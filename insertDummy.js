import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertData() {
  try {
    console.log("Inserting families...");
    // Insert 2 families
    const { data: families, error: familiesError } = await supabase
      .from('families')
      .insert([
        { no_kk: '3201234567890001', address: 'Jl. Merdeka Raya', block_number: 'Blok A No. 1' },
        { no_kk: '3201234567890002', address: 'Jl. Merdeka Raya', block_number: 'Blok A No. 2' }
      ])
      .select();

    if (familiesError) {
      console.error("Error inserting families:", familiesError);
      return;
    }

    const family1 = families.find(f => f.no_kk === '3201234567890001');
    const family2 = families.find(f => f.no_kk === '3201234567890002');

    console.log("Inserting residents...");
    // Insert 4 members for family 1
    const { error: res1Error } = await supabase
      .from('residents')
      .insert([
        { family_id: family1.id, nik: '3201011111111111', full_name: 'Budi Santoso', phone_number: '081200000001', role: 'warga', status: 'Aktif' },
        { family_id: family1.id, nik: '3201011111111112', full_name: 'Siti Aminah', phone_number: '081200000002', role: 'warga', status: 'Aktif' },
        { family_id: family1.id, nik: '3201011111111113', full_name: 'Arif Santoso', phone_number: null, role: 'warga', status: 'Aktif' },
        { family_id: family1.id, nik: '3201011111111114', full_name: 'Rina Santoso', phone_number: null, role: 'warga', status: 'Aktif' }
      ]);

    if (res1Error) {
      console.error("Error inserting residents 1:", res1Error);
      return;
    }

    // Insert 4 members for family 2
    const { error: res2Error } = await supabase
      .from('residents')
      .insert([
        { family_id: family2.id, nik: '3201022222222221', full_name: 'Agus Setiawan', phone_number: '081300000001', role: 'warga', status: 'Aktif' },
        { family_id: family2.id, nik: '3201022222222222', full_name: 'Dewi Lestari', phone_number: '081300000002', role: 'warga', status: 'Aktif' },
        { family_id: family2.id, nik: '3201022222222223', full_name: 'Bima Setiawan', phone_number: null, role: 'warga', status: 'Aktif' },
        { family_id: family2.id, nik: '3201022222222224', full_name: 'Citra Setiawan', phone_number: null, role: 'warga', status: 'Aktif' }
      ]);

    if (res2Error) {
      console.error("Error inserting residents 2:", res2Error);
      return;
    }

    console.log("Successfully inserted 2 families and 8 residents!");
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

insertData();
