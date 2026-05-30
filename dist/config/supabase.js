"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';
if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase URL or Service Key. Supabase client may fail to initialize.');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
