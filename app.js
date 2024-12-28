async function fetchBistData() {
  const apiKey = 'apikey 6jabuxOJykQ3XiqAd7sKUP:6bSOrkc6cMNusix54TNzYK';

  /*
Example Response:

{
    "success": true,
    "result": [
        {
            "rate": 0.26,
            "lastprice": 290.75,
            "lastpricestr": "290,75",
            "hacim": 6888730744.75,
            "hacimstr": "₺6.888.730.744,75",
            "min": 289.75,
            "minstr": "289,75",
            "max": 293.25,
            "maxstr": "293,25",
            "time": "18:10",
            "text": "TURK HAVA YOLLARI",
            "code": "THYAO"
        },
        {
            "rate": 0.29,
            "lastprice": 13.66,
            "lastpricestr": "13,66",
            "hacim": 4320228590.67,
            "hacimstr": "₺4.320.228.590,67",
            "min": 13.58,
            "minstr": "13,58",
            "max": 13.75,
            "maxstr": "13,75",
            "time": "18:10",
            "text": "IS BANKASI (C)",
            "code": "ISCTR"
        },

*/
  
  try {
      const response = await fetch('https://api.collectapi.com/economy/hisseSenedi', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': apiKey
          }
      });

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success) {
          // API'den gelen verileri uygulamamızın formatına dönüştürme
          const transformedData = filterAndTransform(data.result);
          return transformedData;
      }
      return null;
  } catch (error) {
      console.error('Veri çekme hatası:', error);
      return null;
  }
}

// Hisse senetlerinin sektör eşleştirmeleri
const sectorMap = {
   // Bankacılık ve Finans
   'AKBNK': 'Bankacılık',
   'GARAN': 'Bankacılık',
   'ISCTR': 'Bankacılık',
   'YKBNK': 'Bankacılık',
   'VAKBN': 'Bankacılık',
   'HALKB': 'Bankacılık',
   'SKBNK': 'Bankacılık',
   'ALBRK': 'Bankacılık',
   'ICBCT': 'Bankacılık',
   'QNBFK': 'Bankacılık',
   'TSKB': 'Bankacılık',
   'KLNMA': 'Bankacılık',
   
   // Sigorta
   'TURSG': 'Sigorta',
   'ANSGR': 'Sigorta',
   'AKGRT': 'Sigorta',
   'ANHYT': 'Sigorta',
   'AGESA': 'Sigorta',

   // Holding
   'KCHOL': 'Holding',
   'SAHOL': 'Holding',
   'SISE': 'Holding',
   'DOHOL': 'Holding',
   'TAVHL': 'Holding',
   'TKFEN': 'Holding',
   'PEHOL': 'Holding',
   'AGHOL': 'Holding',
   'GLYHO': 'Holding',
   'GSDHO': 'Holding',
   'NTHOL': 'Holding',
   'ALARK': 'Holding',
   'AYKHO': 'Holding',
   'INVEO': 'Holding',
   
   // Sanayi
   'ASELS': 'Sanayi',
   'TOASO': 'Sanayi',
   'TUPRS': 'Sanayi',
   'EREGL': 'Sanayi',
   'KRDMD': 'Sanayi',
   'KRDMA': 'Sanayi',
   'KRDMB': 'Sanayi',
   'SASA': 'Sanayi',
   'CEMTS': 'Sanayi',
   'CIMSA': 'Sanayi',
   'OYAKC': 'Sanayi',
   'AKCNS': 'Sanayi',
   'BUCIM': 'Sanayi',
   'BTCIM': 'Sanayi',
   'NUHCM': 'Sanayi',
   
   // Teknoloji
   'LOGO': 'Teknoloji',
   'ARENA': 'Teknoloji',
   'ARDYZ': 'Teknoloji',
   'FONET': 'Teknoloji',
   'KFEIN': 'Teknoloji',
   'NETAS': 'Teknoloji',
   'INDES': 'Teknoloji',
   'KAREL': 'Teknoloji',
   
   // Telekomünikasyon
   'TCELL': 'Telekomünikasyon',
   'TTKOM': 'Telekomünikasyon',
   
   // Perakende
   'MGROS': 'Perakende',
   'BIMAS': 'Perakende',
   'SOKM': 'Perakende',
   'CRFSA': 'Perakende',
   'VAKKO': 'Perakende',
   
   // Enerji
   'AYDEM': 'Enerji',
   'AKENR': 'Enerji',
   'AKSEN': 'Enerji',
   'AKSA': 'Enerji',
   'ZOREN': 'Enerji',
   'ODAS': 'Enerji',
   'EUPWR': 'Enerji',
   'CONSE': 'Enerji',
   'NATEN': 'Enerji',
   'AKFYE': 'Enerji',
   'GWIND': 'Enerji',
   'KARYE': 'Enerji',
   'HUNER': 'Enerji',
   'YEOTK': 'Enerji',
   'ENJSA': 'Enerji',
   'AYEN': 'Enerji',
   
   // Gıda
   'BANVT': 'Gıda',
   'CCOLA': 'Gıda',
   'KERVT': 'Gıda',
   'PETUN': 'Gıda',
   'TATGD': 'Gıda',
   'ULKER': 'Gıda',
   'YAPRK': 'Gıda',
   'GOKNR': 'Gıda',
   'SELVA': 'Gıda',
   'SOKE': 'Gıda',
   'TUKAS': 'Gıda',
   'ATAKP': 'Gıda',
   'KUVVA': 'Gıda',
   'KNFRT': 'Gıda',
   'PNSUT': 'Gıda',
   'PINSU': 'Gıda',
   'VANGD': 'Gıda',
   'AEFES': 'Gıda',
   'ULUUN': 'Gıda',
   'TBORG': 'Gıda',
   
   // Otomotiv
   'FROTO': 'Otomotiv',
   'TOASO': 'Otomotiv',
   'ARCLK': 'Otomotiv',
   'BFREN': 'Otomotiv',
   'DOAS': 'Otomotiv',
   'KARSN': 'Otomotiv',
   'OTKAR': 'Otomotiv',
   'TTRAK': 'Otomotiv',
   'ASUZU': 'Otomotiv',
   'TMSN': 'Otomotiv',
   'BRYAT': 'Otomotiv',
   'KLMSN': 'Otomotiv',
   
   // İnşaat ve Gayrimenkul
   'EKGYO': 'İnşaat ve Gayrimenkul',
   'ENKAI': 'İnşaat ve Gayrimenkul',
   'ISGYO': 'İnşaat ve Gayrimenkul',
   'KLGYO': 'İnşaat ve Gayrimenkul',
   'PEKGY': 'İnşaat ve Gayrimenkul',
   'RYGYO': 'İnşaat ve Gayrimenkul',
   'VKGYO': 'İnşaat ve Gayrimenkul',
   'MSGYO': 'İnşaat ve Gayrimenkul',
   'DZGYO': 'İnşaat ve Gayrimenkul',
   'SRVGY': 'İnşaat ve Gayrimenkul',
   'TRGYO': 'İnşaat ve Gayrimenkul',
   'MHRGY': 'İnşaat ve Gayrimenkul',
   'TDGYO': 'İnşaat ve Gayrimenkul',
   'OZKGY': 'İnşaat ve Gayrimenkul',
   'HLGYO': 'İnşaat ve Gayrimenkul',
   
   // Spor
   'GSRAY': 'Spor',
   'BJKAS': 'Spor',
   'FENER': 'Spor',
   'TSPOR': 'Spor',
   
   // Havacılık
   'THYAO': 'Havacılık',
   'PGSUS': 'Havacılık',
   
   // Madencilik
   'KOZAA': 'Madencilik',
   'KOZAL': 'Madencilik',
   'IPEKE': 'Madencilik',
   
   // Kimya
   'PETKM': 'Kimya',
   'ALKIM': 'Kimya',
   'BAGFS': 'Kimya',
   'GUBRF': 'Kimya',
   'HEKTS': 'Kimya',
   
   // İlaç
   'ECILC': 'İlaç',
   'MPARK': 'İlaç',
   'SELEC': 'İlaç',
   'DEVA': 'İlaç',
   
   // Tekstil
   'KORDS': 'Tekstil',
   'MAVI': 'Tekstil',
   'YATAS': 'Tekstil',
   'BRMEN': 'Tekstil',
   'SNKRN': 'Tekstil',
   'DESA': 'Tekstil',
   
   // Ulaştırma
   'RYSAS': 'Ulaştırma',
   'CLEBI': 'Ulaştırma',
   
   // Turizm
   'METUR': 'Turizm',
   'MAALT': 'Turizm',
   'AYCES': 'Turizm',
   
   // Medya
   'HURGZ': 'Medya',
   'IHLAS': 'Medya',
   
   // Cam
   'TRKCM': 'Cam',
   'SISE': 'Cam',
   'CGCAM': 'Cam'
};

// Sektörlerin görüntülenme sırası (en düşük değer en solda gösterilir)
const sectorOrder = {
    // Finans grubu (en çok takip edilen)
    'Bankacılık': 1,
    'Holding': 2,
    
    // Sanayi ve üretim grubu
    'Sanayi': 3,
    'Otomotiv': 4,
    
    // Teknoloji ve iletişim grubu
    'Teknoloji': 5,
    'Telekomünikasyon': 6,
    
    // Enerji ve altyapı grubu
    'Enerji': 7,
    'İnşaat ve Gayrimenkul': 8,
    
    // Tüketici grubu
    'Perakende': 9,
    'Gıda': 10,
    
    // Ulaşım grubu
    'Havacılık': 11,
    
    // En sonda
    'Diğer': 999
};

function filterAndTransform(apiData) {
    if (!apiData || !apiData.length) return null;

    // Sektörlere göre grupla
    const sectorGroups = {};
    const unmappedStocks = []; // Tanımlanmamış hisseleri topla

    apiData.forEach(stock => {
        // Sektör haritasından sektörü bul
        const sector = sectorMap[stock.code];
        
        if (!sector) {
            unmappedStocks.push(stock.code); // Tanımlanmamış hisseyi kaydet
            return; // Bu hisseyi atla
        }
        
        if (!sectorGroups[sector]) {
            sectorGroups[sector] = [];
        }
        sectorGroups[sector].push(stock);
    });

    // Tanımlanmamış hisseleri konsola yazdır
    if (unmappedStocks.length > 0) {
        console.log('Sektörü tanımlanmamış hisseler:', unmappedStocks.join(', '));
    }

    // Treemap formatına dönüştür
    return {
        name: "BIST",
        children: Object.entries(sectorGroups)
            .map(([sector, stocks]) => ({
                name: sector,
                children: stocks
                    .sort((a, b) => parseFloat(b.hacim) - parseFloat(a.hacim))
                    .map(stock => ({
                        name: stock.code,
                        volume: parseFloat(stock.hacim) || 0,
                        value: parseFloat(stock.lastprice) || 0,
                        price: parseFloat(stock.lastprice) || 0,
                        pc: parseFloat(stock.rate) || 0,
                        fullName: stock.text || stock.code
                    }))
            }))
            .sort((a, b) => {
                const aVolume = a.children.reduce((sum, stock) => sum + stock.volume, 0);
                const bVolume = b.children.reduce((sum, stock) => sum + stock.volume, 0);
                return bVolume - aVolume;
            })
    };
}

let data = null;

// Add loading indicator
const loadingDiv = d3.select("#chart")
    .append("div")
    .attr("class", "loading")
    .style("display", "none")
    .text("Veriler yükleniyor...");

async function updateVisualization() {
    // Show loading
    loadingDiv.style("display", "block");
    
    const newData = await fetchBistData();
    if (newData) {
        data = newData;
        loadingDiv.style("display", "none");
        redraw(); // Redraw with new data
    } else {
        loadingDiv.text("Veri yüklenemedi. Tekrar deneniyor...");
        // Retry after 5 seconds if failed
        setTimeout(updateVisualization, 5000);
    }
}

// Initial data fetch
updateVisualization();

// Update every 5 minutes
setInterval(updateVisualization, 5 * 60 * 1000);

let chartDiv = document.getElementById("chart");
let svg = d3.select(chartDiv).append("svg");

// Format numbers with Turkish locale
let format = d3.format(",.2f"); // İki ondalık basamak ve binlik ayracı

let colors = [
    "#AA2121",
    "#C84040",
    "#ED7171",
    "#7EC17E",
    "#518651",
    "#215E2C"
];

function getColor(val) {
    let color = "red"
    switch (parseInt(val)) {
        case -10:
        case -9:
        case -8:
        case -7:
            color = colors[0]
            break;
        case -6:
        case -5:
        case -4:
        case -3:
            color = colors[1]
            break;
        case -2:
        case -1:
            color = colors[2]
            break;
        case 0:
        case 1:
        case 2:
            color = colors[3]
            break;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            color = colors[4]
            break;
        default:
            color = colors[5]
    }
    return color
}

var tooltip = d3.select("#chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function redraw() {
    // Don't try to draw if we don't have data yet
    if (!data) return;
    
    var width = chartDiv.clientWidth;
    var height = chartDiv.clientHeight;

    d3.select("svg").html("");

    let chart = () => {
        // Create hierarchy from data
        const root = d3.hierarchy(data)
            .sum(d => d.volume)
            .sort((a, b) => {
                // Kök seviyesinde (sektörler) manuel sıralama kullan
                if (a.depth === 1 && b.depth === 1) {
                    const orderA = sectorOrder[a.data.name] || 998; // Tanımsız sektörler sona yakın
                    const orderB = sectorOrder[b.data.name] || 998;
                    return orderA - orderB;
                }
                // Alt seviyede (hisseler) hacme göre sırala
                return b.value - a.value;
            });

        // Treemap boyutlarını güncelle
        treemap.size([width, height]);
        
        // Apply the treemap layout
        treemap(root);

        const svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height)
            .classed("svg-content-responsive", true);

        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`)
            .on("mousemove", function (d) {
                // console.log(d)
                tooltip.transition()
                    .duration(300)
                    .style("opacity", .98);
                tooltip.html(`<div class="tooltip-body" data-id=${d.data.name}>
                  <ul>
                    <li>Şirket: ${d.data.fullName}</li>
                    <li>Fiyat: ₺${format(d.data.price)}</li>
                    <li>Değişim: %${d.data.pc}</li>
                    <li>Hacim: ₺${format(d.data.volume)}</li>
                  </ul>
                  </div>`)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // leaf.append("title").text(
        //   d =>
        //     `${d
        //       .ancestors()
        //       .reverse()
        //       .map(d => d.data.name)
        //       .join("/")}\n${format(d.value)}`
        // );

        leaf
            .append("rect")
            .attr("id", d => (d.leafUid = "#leaf").id)
            .attr("fill", (d) => getColor(d.data.pc))
            .attr("fill-opacity", 1.0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("class", (d) => "node level-" + d.depth);

        let txt = leaf
            .append("text")
            .attr("fill", "#fff")
            .attr("text-anchor", "middle")
            .attr("class", "shadow")
            .attr("y", function () {
                const parentData = d3.select(this.parentNode).datum();
                return (parentData.y1 - parentData.y0) / 2;
            })
            .attr("font-size", d => Math.min(d.x1 - d.x0, d.y1 - d.y0) / 6);

        // Add a <tspan class="title"> for every data element.
        txt.append("tspan")
            .text(d => d.data.name)
            .attr("class", "title")
            .attr("dy", "-1.5em")
            .attr("x", function () {
                const parentData = d3.select(this.parentNode).datum();
                return (parentData.x1 - parentData.x0) / 2;
            });

        // Add a <tspan class="author"> for every data element.
        txt.append("tspan")
            .text(d => `₺${format(d.data.price)}`)
            .attr("class", "price")
            .attr("dy", "1.4em")
            .attr("x", function () {
                const parentData = d3.select(this.parentNode).datum();
                return (parentData.x1 - parentData.x0) / 2;
            });

        // Add a <tspan class="author"> for every data element.
        txt.append("tspan")
            .text(d => (d.data.pc > 0) ? `+${d.data.pc}` : `${d.data.pc}`)
            .attr("class", "percent")
            .attr("dy", "1.4em")
            .attr("x", function () {
                const parentData = d3.select(this.parentNode).datum();
                return (parentData.x1 - parentData.x0) / 2;
            });

        // Add title for the top level
        svg
            .selectAll("titles")
            .data(
                root.descendants().filter(function (d) {
                    return d.depth == 1;
                })
            )
            .enter()
            .append('g')
            .attr("x", (d) => d.x0)
            .attr("y", (d) => d.y0)
            .attr("dx", (d) => d.x0 + d.x1)
            .attr("dy", (d) => d.y0 + d.y1)
            .append("text")
            .attr("x", (d) => d.x0 + 3)
            .attr("y", (d) => d.y0 + 18)
            .text((d) => d.data.name)
            .attr("font-size", "16px")
            .attr("font-weight", "400")
            .attr("fill", "#fff");

        return svg.node();
    };

    let treemap = d3
        .treemap()
        .size([width, height])
        .paddingOuter(3)
        .paddingTop(19)
        .paddingInner(2)
        .round(true);

    chart();
}

// Draw for the first time to initialize.
redraw();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);

// ZOOM Function
var instance = panzoom(document.getElementById("chart"), {
    zoomSpeed: 0.06,
    maxZoom: 20,
    minZoom: 1
});

instance.on("panstart", function (e) {
    console.log("Fired when pan is just started ", e);
    // Note: e === instance.
});

instance.on("pan", function (e) {
    console.log("Fired when the scene is being panned", e);
});

instance.on("panend", function (e) {
    console.log("Fired when pan ended", e);
});

instance.on("zoom", function (e) {
    console.log("Fired when scene is zoomed", e);
});

instance.on("transform", function (e) {
    // This event will be called along with events above.
    console.log("Fired when any transformation has happened", e);
});