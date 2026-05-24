require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Solução para suporte a WebSocket no Node.js < 22
if (typeof WebSocket === 'undefined') {
  global.WebSocket = require('ws');
}

let supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Limpar a URL caso ela venha com o sufixo /rest/v1/ do dashboard ou .env
if (supabaseUrl && supabaseUrl.includes('/rest/v1/')) {
  supabaseUrl = supabaseUrl.replace('/rest/v1/', '');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
