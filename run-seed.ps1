# PowerShell script to seed and verify tutorial platform

# Kill existing backend processes
Write-Host "Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Write TypeScript seed script to file
$seedScript = @'
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
function hashPassword(p) { return crypto.scryptSync(p, 'local-salt', 64).toString('hex'); }

async function main() {
  await prisma.course.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.note.deleteMany();
  await prisma.lessonMedia.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.courseTag.deleteMany();

  const admin = await prisma.user.create({
    data: {
      supabaseId: 'seed-admin',
      email: 'admin@pksingh.com',
      fullName: 'PK Singh Admin',
      role: 'SUPER_ADMIN',
      passwordHash: hashPassword('adminpassword123'),
    }
  });

  const tags = [
    { name: 'JEE_MAINS', slug: 'jee-mains' },
    { name: 'JEE_ADVANCED', slug: 'jee-advanced' },
    { name: 'NEET', slug: 'neet' },
    { name: 'SAT', slug: 'sat' }
  ];
  for (const tag of tags) {
    await prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag });
  }

  const tagMap = {};
  for (const t of await prisma.tag.findMany()) { tagMap[t.name] = t.id; }

  const physics = await prisma.course.create({
    data: {
      title: 'JEE Physics — Complete Mechanics & Electrostatics',
      description: 'Full JEE Physics preparation covering mechanics and electrostatics',
      subject: 'PHYSICS',
      isFree: false,
      status: 'PUBLISHED',
      sortOrder: 1,
    }
  });
  for (const tag of ['JEE_MAINS', 'JEE_ADVANCED', 'NEET']) {
    await prisma.courseTag.create({ data: { courseId: physics.id, tagId: tagMap[tag] } });
  }

  const chemistry = await prisma.course.create({
    data: {
      title: 'NEET Chemistry — Organic & Inorganic Complete',
      description: 'Complete NEET Chemistry covering organic and inorganic compounds',
      subject: 'CHEMISTRY',
      isFree: false,
      status: 'PUBLISHED',
      sortOrder: 2,
    }
  });
  for (const tag of ['NEET', 'JEE_ADVANCED']) {
    await prisma.courseTag.create({ data: { courseId: chemistry.id, tagId: tagMap[tag] } });
  }

  const math = await prisma.course.create({
    data: {
      title: 'SAT Math — Advanced Algebra & Geometry',
      description: 'Advanced mathematics for SAT covering algebra, geometry, and trigonometry',
      subject: 'MATH',
      isFree: false,
      status: 'PUBLISHED',
      sortOrder: 3,
    }
  });
  for (const tag of ['SAT', 'JEE_MAINS']) {
    await prisma.courseTag.create({ data: { courseId: math.id, tagId: tagMap[tag] } });
  }

  console.log('Successfully seeded comprehensive demo courses!');
  console.log('Admin: admin@pksingh.com / adminpassword123');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
'@

# Write the seed script to file
$seedScript | Out-File -FilePath "A:\Pksingh_iitiim\seed-data.ts" -Encoding UTF8 -Newline "`n"

# Run the seed script
Write-Host "Running TypeScript seed script..." -ForegroundColor Cyan
npx ts-node seed-data.ts
Start-Sleep -Seconds 5

# Restart backend processes
Write-Host "Restarting backend..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start backend as background job
$null = Start-Job -Name "BE" -ScriptBlock { Set-Location 'A:\Pksingh_iitiim'; node dist/server.js }
Start-Sleep -Seconds 8

# Test backend is running
try {
  $r = Invoke-WebRequest -Uri "http://localhost:4000/api/health" -UseBasicParsing -TimeoutSec 5
  Write-Host "Backend: $($r.StatusCode) - $($r.Content)" -ForegroundColor Green
} catch {
  Write-Host "Backend failed to start" -ForegroundColor Red
  exit 1
}

# Login and test the data
Write-Host "\nLogging in as admin..." -ForegroundColor Cyan
$token = ((Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" -Method POST -Body '{"email":"admin@pksingh.com","password":"adminpassword123"}' -ContentType "application/json" -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json).accessToken
$headers = @{ Authorization = "Bearer $token" }

# List courses to verify data
Write-Host "\n=== COURSES DATA ===" -ForegroundColor Yellow
$courses = (Invoke-WebRequest -Uri "http://localhost:4000/api/courses" -Headers $headers -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json
Write-Host "Number of courses in database: $($courses.courses.Count)"

if ($courses.courses.Count -gt 0) {
  Write-Host "Sample courses:"
  $courses.courses | ForEach-Object {
    Write-Host "  - $($_.title)"
  }

  # Get stats
  $stats = (Invoke-WebRequest -Uri "http://localhost:4000/api/courses/stats" -Headers $headers -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json
  Write-Host "\n=== STATS ==="
  $stats.Content.stats | ConvertTo-Json -Depth 3

  Write-Host "\n=== SUCCESS: Database with real course data populated ===" -ForegroundColor Green
  Write-Host "The tutorial platform now has a comprehensive demo with real courses!" -ForegroundColor Yellow
} else {
  Write-Host "ERROR: No courses found in database" -ForegroundColor Red
  exit 1
}
