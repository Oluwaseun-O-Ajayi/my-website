const CERTS_DATA_PATH = "content/certificates.json";
const CERTS_FILE_BASE_PATH = "files/professional-certificates/";

const container = document.getElementById("certificatesList");

const buildCertUrl = (folder, file) =>
  window.resolveSiteUrl(`${CERTS_FILE_BASE_PATH}${encodeURIComponent(folder)}/${encodeURIComponent(file)}`);

const renderCertError = (message) => {
  if (!container) return;
  container.innerHTML = "";
  const p = document.createElement("p");
  p.className = "news-empty";
  p.textContent = message;
  container.appendChild(p);
};

const initializeCertificates = async () => {
  if (!container) return;

  try {
    const response = await fetch(window.resolveSiteUrl(CERTS_DATA_PATH), { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch certificates data.");
    }

    const categories = await response.json();
    if (!Array.isArray(categories) || categories.length === 0) {
      renderCertError("No certificates listed yet.");
      return;
    }

    container.innerHTML = "";

    categories.forEach((cat) => {
      const section = document.createElement("section");
      section.className = "cv-section";

      const heading = document.createElement("h2");
      const count = Array.isArray(cat.items) ? cat.items.length : 0;
      heading.textContent = `${cat.category} (${count})`;
      section.appendChild(heading);

      const list = document.createElement("ul");
      list.className = "cv-list";

      (cat.items || []).forEach((item) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = buildCertUrl(cat.folder, item.file);
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = item.name;
        li.appendChild(link);
        list.appendChild(li);
      });

      section.appendChild(list);
      container.appendChild(section);
    });
  } catch (err) {
    renderCertError("Unable to load certificates right now.");
  }
};

initializeCertificates();
