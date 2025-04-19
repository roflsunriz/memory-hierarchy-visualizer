// 多言語定義
const translations = {
  // 日本語 (既定値)
  ja: {
    title: "メモリ階層ビジュアライザー",
    description1: "各メモリ階層に対応する電子が、CPUエリアとの間を永続的に往復し続けます。電子の往復速度がアクセス速度を表します。",
    description2: "電子は各エリアの境界線で折り返します。スライダーで全体の時間スケール（アニメーション速度）をリアルタイムに変更できます。",
    timeScale: "時間スケール調整 (対数スケール):",
    currentScale: "現在のスケール:",
    realisticSpeed: "現実の速度比率で表示 (注意: 差が非常に大きいです)",
    cpuRegisters: "CPU<br />+<br />Registers",
    l1Cache: "L1 Cache",
    l2Cache: "L2 Cache",
    l3Cache: "L3 Cache",
    mainMemory: "Main Memory (RAM)",
    ssd: "SSD",
    hdd: "HDD",
    // データシート用
    size: "容量目安:",
    latency: "レイテンシ目安:",
    bandwidth: "帯域幅目安:",
    l1Ratio: "L1比:"
  },
  
  // 英語
  en: {
    title: "Memory Hierarchy Visualizer",
    description1: "Electrons representing each memory hierarchy level continuously move back and forth between the CPU area. The speed of electron movement represents access speed.",
    description2: "Electrons bounce back at the boundary of each area. You can change the overall time scale (animation speed) in real-time using the slider.",
    timeScale: "Time Scale Adjustment (logarithmic scale):",
    currentScale: "Current Scale:",
    realisticSpeed: "Display with realistic speed ratio (note: differences are very large)",
    cpuRegisters: "CPU<br />+<br />Registers",
    l1Cache: "L1 Cache",
    l2Cache: "L2 Cache",
    l3Cache: "L3 Cache",
    mainMemory: "Main Memory (RAM)",
    ssd: "SSD",
    hdd: "HDD",
    // For datasheet
    size: "Approximate Capacity:",
    latency: "Approximate Latency:",
    bandwidth: "Approximate Bandwidth:",
    l1Ratio: "L1 Ratio:"
  },
  
  // 中国語 (簡体字)
  zh: {
    title: "内存层次可视化器",
    description1: "代表每个内存层次的电子在CPU区域之间持续往返。电子往返速度表示访问速度。",
    description2: "电子在每个区域边界处反弹。您可以使用滑块实时更改整体时间尺度（动画速度）。",
    timeScale: "时间尺度调整（对数刻度）：",
    currentScale: "当前尺度：",
    realisticSpeed: "显示真实速度比率（注意：差异非常大）",
    cpuRegisters: "CPU<br />+<br />寄存器",
    l1Cache: "L1 缓存",
    l2Cache: "L2 缓存",
    l3Cache: "L3 缓存",
    mainMemory: "主内存 (RAM)",
    ssd: "固态硬盘",
    hdd: "机械硬盘",
    // 数据表
    size: "大致容量：",
    latency: "大致延迟：",
    bandwidth: "大致带宽：",
    l1Ratio: "L1比率："
  },
  
  // スペイン語
  es: {
    title: "Visualizador de Jerarquía de Memoria",
    description1: "Los electrones que representan cada nivel de jerarquía de memoria se mueven continuamente entre el área de la CPU. La velocidad de movimiento representa la velocidad de acceso.",
    description2: "Los electrones rebotan en el límite de cada área. Puede cambiar la escala de tiempo general (velocidad de animación) en tiempo real usando el control deslizante.",
    timeScale: "Ajuste de Escala de Tiempo (escala logarítmica):",
    currentScale: "Escala Actual:",
    realisticSpeed: "Mostrar con proporción de velocidad realista (nota: las diferencias son muy grandes)",
    cpuRegisters: "CPU<br />+<br />Registros",
    l1Cache: "Caché L1",
    l2Cache: "Caché L2",
    l3Cache: "Caché L3",
    mainMemory: "Memoria Principal (RAM)",
    ssd: "SSD",
    hdd: "HDD",
    // Para hoja de datos
    size: "Capacidad Aproximada:",
    latency: "Latencia Aproximada:",
    bandwidth: "Ancho de Banda Aproximado:",
    l1Ratio: "Relación L1:"
  },
  
  // ヒンディー語
  hi: {
    title: "मेमोरी पदानुक्रम विज़ुअलाइज़र",
    description1: "प्रत्येक मेमोरी स्तर का प्रतिनिधित्व करने वाले इलेक्ट्रॉन CPU क्षेत्र के बीच निरंतर आगे-पीछे आते-जाते रहते हैं। इलेक्ट्रॉन की गति एक्सेस स्पीड को दर्शाती है।",
    description2: "इलेक्ट्रॉन प्रत्येक क्षेत्र की सीमा पर वापस आते हैं। आप स्लाइडर का उपयोग करके वास्तविक समय में समग्र समय पैमाने (एनिमेशन गति) को बदल सकते हैं।",
    timeScale: "समय पैमाना समायोजन (लॉगरिथमिक स्केल):",
    currentScale: "वर्तमान पैमाना:",
    realisticSpeed: "वास्तविक गति अनुपात के साथ प्रदर्शित करें (नोट: अंतर बहुत बड़ा है)",
    cpuRegisters: "CPU<br />+<br />रजिस्टर्स",
    l1Cache: "L1 कैश",
    l2Cache: "L2 कैश",
    l3Cache: "L3 कैश",
    mainMemory: "मुख्य मेमोरी (RAM)",
    ssd: "SSD",
    hdd: "HDD",
    // डेटाशीट के लिए
    size: "अनुमानित क्षमता:",
    latency: "अनुमानित विलंबता:",
    bandwidth: "अनुमानित बैंडविड्थ:",
    l1Ratio: "L1 अनुपात:"
  },
  
  // フランス語
  fr: {
    title: "Visualiseur de Hiérarchie Mémoire",
    description1: "Les électrons représentant chaque niveau de hiérarchie mémoire se déplacent continuellement entre la zone CPU. La vitesse de mouvement représente la vitesse d'accès.",
    description2: "Les électrons rebondissent à la limite de chaque zone. Vous pouvez modifier l'échelle de temps globale (vitesse d'animation) en temps réel à l'aide du curseur.",
    timeScale: "Réglage de l'échelle de temps (échelle logarithmique) :",
    currentScale: "Échelle actuelle :",
    realisticSpeed: "Afficher avec un ratio de vitesse réaliste (note : les différences sont très importantes)",
    cpuRegisters: "CPU<br />+<br />Registres",
    l1Cache: "Cache L1",
    l2Cache: "Cache L2",
    l3Cache: "Cache L3",
    mainMemory: "Mémoire Principale (RAM)",
    ssd: "SSD",
    hdd: "HDD",
    // Pour la fiche technique
    size: "Capacité approximative :",
    latency: "Latence approximative :",
    bandwidth: "Bande passante approximative :",
    l1Ratio: "Ratio L1 :"
  }
};

// 現在の言語を保持する変数（デフォルトは日本語）
let currentLanguage = 'ja';

// 言語を切り替える関数
function changeLanguage(lang) {
  if (!translations[lang]) {
    console.error(`Language "${lang}" is not supported`);
    return;
  }
  
  currentLanguage = lang;
  
  // HTML要素のテキストを更新
  document.title = translations[lang].title;
  document.querySelector('h1').textContent = translations[lang].title;
  
  const descriptionLines = document.querySelector('p.description');
  descriptionLines.innerHTML = `
    ${translations[lang].description1}<br />
    ${translations[lang].description2}<br />
  `;
  
  // コントロール部分
  document.querySelector('label[for="speedSlider"]').textContent = translations[lang].timeScale;
  
  // スライダー値表示の更新（現在のスケール部分だけ翻訳、値は関数で更新）
  const sliderValueText = document.getElementById('sliderValue').textContent;
  // 正規表現で数値とxを抽出（より堅牢な方法）
  const scaleValueMatch = sliderValueText.match(/(\d+\.?\d*)x/);
  const scaleValue = scaleValueMatch ? scaleValueMatch[1] + 'x' : '0.01x'; // デフォルト値を設定
  document.getElementById('sliderValue').textContent = `${translations[lang].currentScale} ${scaleValue}`;
  
  // 現実速度チェックボックス
  document.querySelector('label[for="realisticSpeedCheckbox"]').textContent = translations[lang].realisticSpeed;
  
  // CPU+Registers
  document.getElementById('cpu-area').innerHTML = translations[lang].cpuRegisters;
  
  // 各コンポーネント名
  document.getElementById('l1').innerHTML = translations[lang].l1Cache + 
    '<span class="speed-info"></span>';
  document.getElementById('l2').innerHTML = translations[lang].l2Cache + 
    '<span class="speed-info"></span>';
  document.getElementById('l3').innerHTML = translations[lang].l3Cache + 
    '<span class="speed-info"></span>';
  document.getElementById('ram').innerHTML = translations[lang].mainMemory + 
    '<span class="speed-info"></span>';
  document.getElementById('ssd').innerHTML = translations[lang].ssd + 
    '<span class="speed-info"></span>';
  document.getElementById('hdd').innerHTML = translations[lang].hdd + 
    '<span class="speed-info"></span>';
  
  // 速度情報の更新をトリガー（元の表示を新しい言語で更新）
  if (typeof updateAnimationTimings === 'function') {
    updateAnimationTimings();
  }
  
  // LocalStorageに言語設定を保存
  localStorage.setItem('preferredLanguage', lang);
}

// ページロード時に保存された言語設定を読み込む
function loadPreferredLanguage() {
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang && translations[savedLang]) {
    changeLanguage(savedLang);
  }
}

// データシート表示を更新する関数（script.jsから呼び出し用）
function getTranslatedText(key) {
  return translations[currentLanguage][key] || translations['ja'][key] || key;
} 