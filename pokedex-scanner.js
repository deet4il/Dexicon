/* ==========================================================================
   SyncDex - Pokédex Scanner Engine (Autonomous Module)
   ========================================================================== */

(function () {
  // 1. Build and inject scanner modal DOM automatically on script load
  const modalHTML = `
    <div class="dex-inspect-overlay" id="dexInspectModal">
      <div class="dex-scanner-card" role="dialog" aria-modal="true">
        <div class="scanner-topbar">
          <span id="inspectScannerStatus">POKÉDEX BIOLOGICAL SCANNER</span>
          <button class="scanner-close-btn" id="closeInspectBtn" aria-label="Close scanner">&times;</button>
        </div>
        <div class="scanner-visual-row">
          <div class="scanner-sprite-frame">
            <img id="inspectSprite" src="icon-192.png" alt="Specimen Scan" />
          </div>
          <div class="scanner-meta">
            <span class="scanner-dex-id" id="inspectDexId">#0000</span>
            <span class="scanner-name" id="inspectName">SPECIES</span>
            <span class="scanner-genus" id="inspectGenus">CLASSIFICATION</span>
          </div>
        </div>
        <div class="scanner-readout-screen" id="inspectReadout">
          Initializing scan telemetry...
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('dexInspectModal');
  const closeBtn = document.getElementById('closeInspectBtn');
  const spriteImg = document.getElementById('inspectSprite');
  const dexIdEl = document.getElementById('inspectDexId');
  const nameEl = document.getElementById('inspectName');
  const genusEl = document.getElementById('inspectGenus');
  const readoutEl = document.getElementById('inspectReadout');

  function closeModal() {
    modal.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // 2. Core inspection handler
  async function inspectPokemon(id, fallbackName = '', isShiny = false) {
    if (!id || id <= 0) return;
    modal.style.display = 'flex';

    dexIdEl.textContent = `#${String(id).padStart(4, '0')}`;
    nameEl.textContent = fallbackName || `SPECIMEN #${id}`;
    spriteImg.src = isShiny
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    // Check Caught status in localStorage ledger
    let caughtLedger = [];
    try {
      caughtLedger = JSON.parse(localStorage.getItem('syncdex_caught_ledger')) || [];
    } catch (e) {}

    const caughtEntry = caughtLedger.find((item) => Number(item.id) === Number(id));

    if (!caughtEntry) {
      // LOCKED: Specimen not yet caught
      spriteImg.classList.add('locked-silhouette');
      nameEl.textContent = 'UNKNOWN SPECIMEN';
      genusEl.textContent = 'UNCATALOGED SPECIMEN';
      readoutEl.className = 'scanner-readout-screen locked-screen';
      readoutEl.innerHTML = `
        [DATA ENCRYPTED]<br><br>
        Wild specimen detected in field bounties. Complete its corresponding task to catch the Pokémon and unlock its official Pokédex biological entry.
      `;
      return;
    }

    // UNLOCKED: Specimen registered in PC / Resonance
    spriteImg.classList.remove('locked-silhouette');
    readoutEl.className = 'scanner-readout-screen';

    // If caughtEntry has a clean name, use it as baseline
    if (caughtEntry.name && !caughtEntry.name.startsWith('Specimen #')) {
      nameEl.textContent = caughtEntry.name;
    }

    // Check Local Pokédex Cache
    let dexCache = {};
    try {
      dexCache = JSON.parse(localStorage.getItem('syncdex_dex_cache')) || {};
    } catch (e) {}

    if (dexCache[id]) {
      nameEl.textContent = dexCache[id].name || nameEl.textContent;
      genusEl.textContent = dexCache[id].genus || 'REGISTERED SPECIES';
      readoutEl.textContent = dexCache[id].flavorText;
      return;
    }

    // Live fetch if online and uncached
    genusEl.textContent = 'SCANNING ARCHIVES...';
    readoutEl.textContent = 'Retrieving official Pokédex telemetry...';

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();

      // Extract official English Pokémon species name
      let officialName = data.name.toUpperCase();
      const nameObj = data.names && data.names.find((n) => n.language.name === 'en');
      if (nameObj) officialName = nameObj.name.toUpperCase();

      let genus = 'REGISTERED SPECIES';
      const genusObj = data.genera && data.genera.find((g) => g.language.name === 'en');
      if (genusObj) genus = genusObj.genus;

      let flavorText = 'Biological telemetry successfully registered in local Pokédex memory.';
      const flavorObj = data.flavor_text_entries && data.flavor_text_entries.find((f) => f.language.name === 'en');
      if (flavorObj) {
        flavorText = flavorObj.flavor_text.replace(/[\f\n\r]/g, ' ');
      }

      // Save complete entry with verified species name into cache
      dexCache[id] = { name: officialName, genus, flavorText };
      localStorage.setItem('syncdex_dex_cache', JSON.stringify(dexCache));

      nameEl.textContent = officialName;
      genusEl.textContent = genus;
      readoutEl.textContent = flavorText;
    } catch (err) {
      genusEl.textContent = 'REGISTERED IN PC';
      readoutEl.textContent = 'Biological telemetry registered. Connect to network once to download full historical text.';
    }
  }

  // 3. Global Event Delegation
  document.addEventListener('click', (e) => {
    // A: Click on a Field Task Sprite
    const taskBox = e.target.closest('.task-sprite-box');
    if (taskBox) {
      const card = taskBox.closest('.task-card');
      if (card) {
        const img = taskBox.querySelector('img');
        const match = img && img.src.match(/\/(\d+)\.png/);
        const id = match ? parseInt(match[1], 10) : null;
        const isShiny = card.classList.contains('shiny');
        const altName = (img && img.alt && !img.alt.startsWith('Specimen #')) ? img.alt : '';
        if (id) inspectPokemon(id, altName, isShiny);
      }
      return;
    }

    // B: Click on a PC Box Cell
    const pcCell = e.target.closest('.pc-box-cell');
    if (pcCell) {
      const img = pcCell.querySelector('img');
      const match = img && img.src.match(/\/(\d+)\.png/);
      const id = match ? parseInt(match[1], 10) : null;
      const isShiny = pcCell.classList.contains('shiny');
      const altName = img ? img.alt : '';
      if (id) inspectPokemon(id, altName, isShiny);
      return;
    }

    // C: Click on Daily Resonance Companion Sprite
    const dailyImg = e.target.closest('#dailyPokemonSprite');
    if (dailyImg) {
      const match = dailyImg.src.match(/\/(\d+)\.png/);
      const id = match ? parseInt(match[1], 10) : null;
      const nameEl = document.getElementById('dailyPokemonName');
      const name = nameEl ? nameEl.textContent : '';
      if (id) inspectPokemon(id, name, false);
    }
  });

  // Expose function globally
  window.inspectPokemon = inspectPokemon;
})();
