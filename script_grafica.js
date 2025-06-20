async function getData(url) {
  const res = await fetch(url);
  return await res.json();
}

async function renderCharts() {
  const postulantes = await getData(
    "http://127.0.0.1:8000/catalogo/postulantes/"
  );

  const profesionCount = {};
  const sexoCount = {};

  for (const p of postulantes) {
    const nombreProf = p.Nombre_Profesion || "No asignada";
    profesionCount[nombreProf] = (profesionCount[nombreProf] || 0) + 1;

    sexoCount[p.Sexo] = (sexoCount[p.Sexo] || 0) + 1;
  }

  const profesiones = Object.keys(profesionCount);
  const cantidades = Object.values(profesionCount);

  const sexos = Object.keys(sexoCount);
  const conteoSexo = Object.values(sexoCount);

  // 📊 Gráfico de barras por profesión
  new ApexCharts(document.querySelector("#bar-chart"), {
    chart: { type: "bar", height: 350 },
    series: [{ name: "Postulantes", data: cantidades }],
    xaxis: { categories: profesiones },
  }).render();

  // 🥧 Gráfico de pastel por profesión
  new ApexCharts(document.querySelector("#pie-profesion"), {
    chart: { type: "pie", height: 350 },
    series: cantidades,
    labels: profesiones,
  }).render();

  // 🥧 Gráfico de pastel por sexo
  new ApexCharts(document.querySelector("#pie-sexo"), {
    chart: { type: "pie", height: 350 },
    series: conteoSexo,
    labels: sexos,
  }).render();
}

renderCharts();