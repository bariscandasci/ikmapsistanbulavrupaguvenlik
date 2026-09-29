/**
 * Aday havuzu — Excel yükleme, telefon tekilleştirme ve güvenlik projesine göre skor.
 * Rota hesabı routing_engine.plan üzerinden gelir.
 */
const CANDIDATE_STORE_KEY = "ik_avrupa_guvenlik_candidates_v1";

function normalizePhone(raw) {
  if (!raw) return "";
  let digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return digits;
}

const CandidateStore = {
  _mem: null,
  load() {
    if (this._mem) return this._mem;
    try {
      this._mem = JSON.parse(localStorage.getItem(CANDIDATE_STORE_KEY) || "[]");
    } catch {
      this._mem = [];
    }
    return this._mem;
  },
  save() {
    localStorage.setItem(CANDIDATE_STORE_KEY, JSON.stringify(this.load()));
  },
  clear() {
    this._mem = [];
    this.save();
  },
  upsert(candidate) {
    const all = this.load();
    const phone = normalizePhone(candidate.phone);
    const existing = phone ? all.find((item) => normalizePhone(item.phone) === phone) : null;
    if (existing) Object.assign(existing, candidate, { phone: phone || existing.phone });
    else all.push(Object.assign({ id: "aday_" + Date.now().toString(36) }, candidate, { phone: phone }));
    this.save();
  },
};

function headerKey(text) {
  return String(text || "").toLocaleLowerCase("tr").trim();
}

function columnIndex(headers, words) {
  return headers.findIndex((header) => words.some((word) => headerKey(header).includes(word)));
}

function importWorkbook(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  if (!rows.length) return 0;
  const headers = rows[0].map((cell) => String(cell));
  const idx = {
    name: columnIndex(headers, ["ad soyad", "isim", "adı", "name"]),
    phone: columnIndex(headers, ["telefon", "gsm", "phone"]),
    district: columnIndex(headers, ["ilçe", "ilce"]),
    neighborhood: columnIndex(headers, ["mahalle"]),
    position: columnIndex(headers, ["pozisyon", "görev adı"]),
    armed: columnIndex(headers, ["silah"]),
    duty: columnIndex(headers, ["danışma", "gözetim", "görev tipi"]),
    shift: columnIndex(headers, ["vardiya"]),
    address: columnIndex(headers, ["adres"]),
  };
  let count = 0;
  rows.slice(1).forEach((row) => {
    const name = idx.name >= 0 ? String(row[idx.name] || "").trim() : "";
    const phone = idx.phone >= 0 ? String(row[idx.phone] || "").trim() : "";
    if (!name && !phone) return;
    const positionCell = idx.position >= 0 ? String(row[idx.position] || "") : "";
    const armedCell = idx.armed >= 0 ? String(row[idx.armed] || "").toLocaleLowerCase("tr") : "";
    const shiftCell = idx.shift >= 0 ? String(row[idx.shift] || "") : "";
    CandidateStore.upsert({
      fullName: name || "Adsız aday",
      phone: phone,
      districtName: idx.district >= 0 ? String(row[idx.district] || "") : "",
      neighborhoodName: idx.neighborhood >= 0 ? String(row[idx.neighborhood] || "") : "",
      position: positionCell,
      armed: armedCell.includes("silahlı") && !armedCell.includes("sız") ? "silahli" : armedCell.includes("silahsız") || armedCell.includes("silahsiz") ? "silahsiz" : "",
      duty: idx.duty >= 0 ? String(row[idx.duty] || "") : "",
      shiftPattern: shiftCell.includes("2+2") ? "2+2+2" : shiftCell.includes("12") ? "12/36" : shiftCell.includes("8") ? "8/16" : "",
      addressText: idx.address >= 0 ? String(row[idx.address] || "") : "",
    });
    count += 1;
  });
  return count;
}

function matchOrigin(candidate) {
  const districtName = headerKey(candidate.districtName);
  const neighborhoodName = headerKey(candidate.neighborhoodName);
  let district = ISTANBUL_AVRUPA_DATA.districts.find((item) => headerKey(item.name) === districtName);
  if (!district && districtName) {
    district = ISTANBUL_AVRUPA_DATA.districts.find((item) => headerKey(item.name).includes(districtName) || districtName.includes(headerKey(item.name)));
  }
  if (!district) return null;
  const neighborhood = (district.neighborhoods || []).find((item) => headerKey(item.name) === neighborhoodName);
  const point = neighborhood || district;
  return { lat: point.lat, lng: point.lng, name: neighborhood ? neighborhood.name + " / " + district.name : district.name };
}

function scoreCandidate(candidate, project) {
  let score = 40;
  const notes = [];
  if (candidate.position && project.position && headerKey(candidate.position).includes(headerKey(project.position).split(" ")[0])) {
    score += 25;
    notes.push("pozisyon");
  }
  if (candidate.armed && candidate.armed === project.armed) {
    score += 15;
    notes.push(project.armed === "silahli" ? "silahlı" : "silahsız");
  }
  if (candidate.shiftPattern && candidate.shiftPattern === project.shiftPattern) {
    score += 10;
    notes.push(project.shiftPattern);
  }
  const origin = matchOrigin(candidate);
  let route = null;
  if (origin) {
    route = routing_engine.plan(origin, { lat: project.lat, lng: project.lng, name: project.name }, { fixedSide: "origin" });
    if (route && route.verified) score += Math.max(0, 25 - Math.floor(route.durationMin / 6));
    else score -= 10;
  } else {
    score -= 15;
    notes.push("konum yok");
  }
  return { score: Math.max(0, Math.min(100, score)), notes: notes, route: route, origin: origin };
}

function updatePoolCount() {
  const el = document.getElementById("candidatePoolCount");
  if (el) el.textContent = String(CandidateStore.load().length);
}
updatePoolCount();

const uploadModal = document.getElementById("uploadCandidatesModal");
document.getElementById("uploadCandidatesBtn").addEventListener("click", () => {
  updatePoolCount();
  uploadModal.classList.remove("hidden");
});
document.getElementById("uploadCandidatesClose").addEventListener("click", () => uploadModal.classList.add("hidden"));
document.getElementById("uploadCandidatesCancel").addEventListener("click", () => uploadModal.classList.add("hidden"));
document.getElementById("candidateClearAllBtn").addEventListener("click", () => {
  CandidateStore.clear();
  updatePoolCount();
  document.getElementById("candidateUploadStatus").textContent = "Aday havuzu silindi.";
});
document.getElementById("candidateFileInput").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  const status = document.getElementById("candidateUploadStatus");
  if (!file) return;
  if (typeof XLSX === "undefined") {
    status.textContent = "Excel kütüphanesi yüklenemedi.";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const workbook = XLSX.read(reader.result, { type: "array" });
      const count = importWorkbook(workbook);
      updatePoolCount();
      status.textContent = count + " satır işlendi. Havuzda " + CandidateStore.load().length + " aday var.";
    } catch (error) {
      status.textContent = "Dosya okunamadı.";
    }
  };
  reader.readAsArrayBuffer(file);
});

const candidateView = document.getElementById("candidateFullscreenView");
const candidateList = document.getElementById("candidateFsList");
const candidateDetail = document.getElementById("candidateFsDetail");
const candidateProjectSelect = document.getElementById("candidateFsProjectSelect");

function fillCandidateProjectSelect(selectedId) {
  candidateProjectSelect.innerHTML = '<option value="">Proje seçin</option>';
  window.ikApp.activeProjects().forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    candidateProjectSelect.appendChild(option);
  });
  if (selectedId) candidateProjectSelect.value = selectedId;
}

function renderCandidateDetail(candidate, scored, project) {
  const routeLine = scored.route
    ? `~${scored.route.durationMin} dk · ${scored.route.transfers} aktarma · ${scored.route.verified ? "omurga" : "doğrulanamadı"}`
    : "Konum eşleşmedi";
  candidateDetail.innerHTML = `
    <h2 class="text-lg font-bold text-slate-800">${window.ikApp.escapeHtml(candidate.fullName)}</h2>
    <p class="text-sm text-slate-500 mt-1">${window.ikApp.escapeHtml(candidate.phone || "telefon yok")} · skor ${scored.score}</p>
    <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700">
      <div>Pozisyon: ${window.ikApp.escapeHtml(candidate.position || "—")}</div>
      <div>Silah: ${window.ikApp.escapeHtml(candidate.armed || "—")}</div>
      <div>Vardiya: ${window.ikApp.escapeHtml(candidate.shiftPattern || "—")}</div>
      <div>İlçe: ${window.ikApp.escapeHtml(candidate.districtName || "—")}</div>
    </div>
    <p class="mt-4 text-sm text-slate-600">${window.ikApp.escapeHtml(project.name)} için ulaşım: ${window.ikApp.escapeHtml(routeLine)}</p>
    <p class="mt-2 text-xs text-slate-400">${window.ikApp.escapeHtml(scored.notes.join(", ") || "ek eşleşme notu yok")}</p>`;
}

function renderProjectToCandidates(projectId) {
  const project = window.ikApp.projectById(projectId);
  candidateList.innerHTML = "";
  if (!project) {
    candidateDetail.textContent = "Proje seçin.";
    return;
  }
  const ranked = CandidateStore.load()
    .map((candidate) => ({ candidate: candidate, scored: scoreCandidate(candidate, project) }))
    .sort((a, b) => b.scored.score - a.scored.score);
  document.getElementById("candidateFsCount").textContent = ranked.length + " aday";
  if (!ranked.length) {
    candidateList.innerHTML = '<p class="text-sm text-slate-400">Aday havuzu boş. Aday Yükle ile Excel ekleyin.</p>';
    candidateDetail.textContent = "Eşleşecek aday yok.";
    return;
  }
  ranked.forEach((row, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "candidate-card" + (index === 0 ? " candidate-card-selected" : "");
    const route = row.scored.route;
    button.innerHTML = `<div class="font-semibold text-slate-800">${window.ikApp.escapeHtml(row.candidate.fullName)}</div>
      <div class="text-xs text-slate-500">skor ${row.scored.score}${route ? " · ~" + route.durationMin + " dk" : ""}</div>`;
    button.addEventListener("click", () => {
      candidateList.querySelectorAll(".candidate-card").forEach((item) => item.classList.remove("candidate-card-selected"));
      button.classList.add("candidate-card-selected");
      renderCandidateDetail(row.candidate, row.scored, project);
    });
    candidateList.appendChild(button);
    if (index === 0) renderCandidateDetail(row.candidate, row.scored, project);
  });
}

function openCandidateView(projectId) {
  fillCandidateProjectSelect(projectId);
  candidateView.classList.remove("hidden");
  if (projectId) renderProjectToCandidates(projectId);
}
window.openCandidateView = openCandidateView;
window.renderProjectToCandidates = renderProjectToCandidates;

document.getElementById("candidateFsBackBtn").addEventListener("click", () => candidateView.classList.add("hidden"));
candidateProjectSelect.addEventListener("change", () => {
  if (candidateProjectSelect.value) renderProjectToCandidates(candidateProjectSelect.value);
});

const batchView = document.getElementById("batchMatchView");
const batchList = document.getElementById("batchMatchProjectList");
const batchResults = document.getElementById("batchMatchResults");

function openBatch() {
  batchList.innerHTML = "";
  window.ikApp.activeProjects().forEach((project) => {
    const row = document.createElement("label");
    row.className = "flex items-center gap-2 text-sm text-slate-700 border border-slate-200 rounded-lg p-2";
    row.innerHTML = `<input type="checkbox" data-id="${project.id}" checked /> <span class="flex-1">${window.ikApp.escapeHtml(project.name)}</span>
      <input data-capacity="${project.id}" type="number" min="0" placeholder="kontenjan" value="${project.capacity == null ? "" : project.capacity}" class="w-24 field-input" />`;
    batchList.appendChild(row);
  });
  if (!window.ikApp.activeProjects().length) {
    batchList.innerHTML = '<p class="text-sm text-slate-400">Açık proje yok.</p>';
  }
  batchResults.textContent = "Proje seçip eşleştirin. Her aday en yüksek skorlu tek projeye gider.";
  batchView.classList.remove("hidden");
}
document.getElementById("batchMatchBtn").addEventListener("click", openBatch);
document.getElementById("batchMatchBackBtn").addEventListener("click", () => batchView.classList.add("hidden"));
document.getElementById("batchMatchRunBtn").addEventListener("click", () => {
  const projects = [...batchList.querySelectorAll("input[type=checkbox]:checked")].map((input) => {
    const project = window.ikApp.projectById(input.dataset.id);
    const capInput = batchList.querySelector(`[data-capacity="${input.dataset.id}"]`);
    const cap = capInput && capInput.value !== "" ? Number(capInput.value) : Infinity;
    return { project: project, capacity: cap, assigned: [] };
  }).filter((item) => item.project);
  const pairs = [];
  CandidateStore.load().forEach((candidate) => {
    projects.forEach((slot) => {
      pairs.push({ candidate: candidate, slot: slot, scored: scoreCandidate(candidate, slot.project) });
    });
  });
  pairs.sort((a, b) => b.scored.score - a.scored.score);
  const used = new Set();
  pairs.forEach((pair) => {
    if (used.has(pair.candidate)) return;
    if (pair.slot.assigned.length >= pair.slot.capacity) return;
    pair.slot.assigned.push(pair);
    used.add(pair.candidate);
  });
  const unmatched = CandidateStore.load().filter((candidate) => !used.has(candidate));
  document.getElementById("batchMatchStatus").textContent = used.size + " atama · " + unmatched.length + " açıkta";
  batchResults.innerHTML = projects.map((slot) => {
    const items = slot.assigned.map((pair) => `<li class="py-1">${window.ikApp.escapeHtml(pair.candidate.fullName)} · skor ${pair.scored.score}${pair.scored.route ? " · ~" + pair.scored.route.durationMin + " dk" : ""}</li>`).join("");
    return `<section class="mb-4"><h3 class="font-bold text-slate-800">${window.ikApp.escapeHtml(slot.project.name)}</h3><ul class="text-sm text-slate-600">${items || "<li>Atama yok</li>"}</ul></section>`;
  }).join("") + (unmatched.length ? `<p class="text-sm text-slate-400">${unmatched.length} aday kontenjan veya proje seçimine sığmadı.</p>` : "");
});
