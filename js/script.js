window.addEventListener("DOMContentLoaded", () => {
  // --- 定数・設定値 ---
  const electronWidth = 7; // 電子の幅 (CSSと合わせる)
  const MIN_SCALE = 0.01;
  const MAX_SCALE = 300;
  const MIN_RAW_SLIDER = 1;
  const MAX_RAW_SLIDER = 100;
  const INITIAL_SCALE = 5;
  const BASE_ANIMATION_TIME_MULTIPLIER = 15;
  const REALISTIC_SPEED_MULTIPLIER = 5;

  const latencies = {
    // 元データ (表示用)
    l1: 4,
    l2: 10,
    l3: 35,
    ram: 120,
    ssd: 8000,
    hdd: 40000,
  };
  const realisticLatenciesRatio = {
    // 現実的比率 (計算用)
    l1: 1,
    l2: 2.5,
    l3: 9,
    ram: 30,
    ssd: 2000,
    hdd: 10000,
  };
  const deformedLatencies = {
    // デフォルメ比率 (計算用)
    l1: 4,
    l2: 10,
    l3: 25,
    ram: 50,
    ssd: 150,
    hdd: 300,
  };
  const componentData = {
    // データシート情報
    l1: { name: "L1 Cache", size: "64 KB", latency: "~1 ns (4 cycles)", bandwidth: "~1000 GB/s" },
    l2: { name: "L2 Cache", size: "256 KB", latency: "~3 ns (10 cycles)", bandwidth: "~400 GB/s" },
    l3: { name: "L3 Cache", size: "8 MB", latency: "~10 ns (35 cycles)", bandwidth: "~200 GB/s" },
    ram: { name: "RAM (DDR4)", size: "16 GB", latency: "~50-120 ns", bandwidth: "~50 GB/s" },
    ssd: {
      name: "NVMe SSD",
      size: "1 TB",
      latency: "~0.02-0.1 ms (20k-100k ns)",
      bandwidth: "~3-7 GB/s",
    },
    hdd: {
      name: "HDD (7200rpm)",
      size: "4 TB",
      latency: "~4-10 ms (4M-10M ns)",
      bandwidth: "~0.2 GB/s",
    },
  };
  const componentIds = ["l1", "l2", "l3", "ram", "ssd", "hdd"];

  // --- DOM要素 ---
  const visualizationArea = document.getElementById("visualization");
  const cpuArea = document.getElementById("cpu-area");
  // const componentsArea = document.getElementById("components-area"); // 未使用のためコメントアウト
  const speedSlider = document.getElementById("speedSlider");
  const sliderValueDisplay = document.getElementById("sliderValue");
  const realisticSpeedCheckbox = document.getElementById("realisticSpeedCheckbox");
  const datasheetDiv = document.getElementById("datasheet");

  // --- 状態変数 ---
  let activeAnimations = new Map(); // IDとアニメーションのペア

  // --- ヘルパー関数 ---

  /** visualizationArea基準の要素座標を取得 */
  function getElementBoundsInVis(element) {
    if (!element) return { left: 0, top: 0, width: 0, height: 0 };
    const visRect = visualizationArea.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    return {
      left: elemRect.left - visRect.left,
      top: elemRect.top - visRect.top,
      width: elemRect.width,
      height: elemRect.height,
      right: elemRect.right - visRect.left,
      bottom: elemRect.bottom - visRect.top,
      centerX: elemRect.left - visRect.left + elemRect.width / 2,
      centerY: elemRect.top - visRect.top + elemRect.height / 2,
    };
  }

  /** スライダー値から対数スケール係数を計算 */
  function getLogScaleFactor(rawValue) {
    const normalized = (rawValue - MIN_RAW_SLIDER) / (MAX_RAW_SLIDER - MIN_RAW_SLIDER);
    return MIN_SCALE * Math.pow(MAX_SCALE / MIN_SCALE, normalized);
  }

  /** 目的のスケール値からスライダー値を計算 */
  function getSliderValueForScale(targetScale) {
    const normalized = Math.log(targetScale / MIN_SCALE) / Math.log(MAX_SCALE / MIN_SCALE);
    return Math.round(normalized * (MAX_RAW_SLIDER - MIN_RAW_SLIDER) + MIN_RAW_SLIDER);
  }

  /** レイテンシ(ns)を適切な単位にフォーマット */
  function formatLatency(ns) {
    if (ns < 1000) return `${ns} ns`;
    if (ns < 1000000) return `${(ns / 1000).toFixed(1)} µs`;
    return `${(ns / 1000000).toFixed(1)} ms`;
  }

  /** 速度吹き出しのテキストを更新 */
  function updateSpeedInfo(componentId, text) {
    const componentElement = document.getElementById(componentId);
    if (componentElement) {
      const speedInfoSpan = componentElement.querySelector(".speed-info");
      if (speedInfoSpan) {
        const isRealistic = realisticSpeedCheckbox.checked;
        const baseLatency = isRealistic ? realisticLatenciesRatio.l1 : deformedLatencies.l1;
        const currentLatency = isRealistic ? realisticLatenciesRatio[componentId] : deformedLatencies[componentId];
        const ratio = (currentLatency / baseLatency).toFixed(1);
        
        // L1キャッシュの場合は比率を表示しない
        const ratioText = componentId === 'l1' ? '' : `(L1比: ${ratio}x)`;
        
        // レイテンシ表示を取得
        const rawLatencyNs = latencies[componentId];
        const formattedLatency = rawLatencyNs !== undefined ? formatLatency(rawLatencyNs) : "?";
        
        // モードに応じたレイテンシ表示
        const latencyText = isRealistic ? formattedLatency : `${deformedLatencies[componentId]}単位`;
        
        speedInfoSpan.textContent = `${latencyText} ${ratioText}`;
      }
    }
  }

  /** アニメーションのDurationを計算し、吹き出しも更新 */
  function getAnimationDuration(componentId) {
    const isRealistic = realisticSpeedCheckbox.checked;
    const rawValue = parseFloat(speedSlider.value);
    const scaleFactor = getLogScaleFactor(rawValue);

    let baseLatency;
    let timeMultiplier = BASE_ANIMATION_TIME_MULTIPLIER;

    if (isRealistic) {
      baseLatency = realisticLatenciesRatio[componentId] || 1;
      timeMultiplier *= REALISTIC_SPEED_MULTIPLIER;
      if (["ssd", "hdd"].includes(componentId)) timeMultiplier *= 5;
    } else {
      baseLatency = deformedLatencies[componentId] || 1;
    }

    let duration = baseLatency * timeMultiplier * scaleFactor;
    duration = Math.max(duration, 10); // 最低10ms

    // 吹き出し更新
    const rawLatencyNs = latencies[componentId];
    const formattedLatency = rawLatencyNs !== undefined ? formatLatency(rawLatencyNs) : "?";
    updateSpeedInfo(componentId, formattedLatency);

    return duration;
  }

  // --- アニメーション関連 ---

  /** 永続的な往復アニメーションを作成・開始 */
  function createAndAnimateEternalPingPong(sourceId) {
    const sourceElement = document.getElementById(sourceId);
    if (!sourceElement || !(sourceId in deformedLatencies)) return;

    // 既存のアニメーションをキャンセル・削除
    if (activeAnimations.has(sourceId)) {
      activeAnimations.get(sourceId)?.cancel(); // ?. で安全に呼び出し
      activeAnimations.delete(sourceId);
    }
    const oldElectron = visualizationArea.querySelector(`.electron[data-component-id="${sourceId}"]`);
    if (oldElectron) oldElectron.remove();

    const sourceBounds = getElementBoundsInVis(sourceElement);
    const cpuBounds = getElementBoundsInVis(cpuArea);
    const yPos = sourceBounds.centerY - electronWidth / 2;
    const startX = sourceBounds.left - electronWidth / 2;
    const endX = cpuBounds.right - electronWidth / 2;
    const distanceX = endX - startX;
    const duration = getAnimationDuration(sourceId); // 内部で吹き出しも更新

    const electron = document.createElement("div");
    electron.classList.add("electron");
    electron.dataset.componentId = sourceId;
    electron.style.left = `${startX}px`;
    electron.style.top = `${yPos}px`;
    visualizationArea.appendChild(electron);

    const animation = electron.animate(
      [{ transform: `translateX(0px)` }, { transform: `translateX(${distanceX}px)` }],
      { duration, iterations: Infinity, direction: "alternate", easing: "linear" }
    );

    activeAnimations.set(sourceId, animation);

    animation.addEventListener("cancel", () => {
      // アニメーションがキャンセルされたら要素を消し、Mapからも削除
      electron.remove();
      activeAnimations.delete(sourceId);
    });
  }

  /** 全てのアニメーションを初期化または更新 */
  function initializeOrUpdateAnimations() {
    visualizationArea.querySelectorAll(".electron").forEach((e) => e.remove());
    activeAnimations.forEach((anim) => anim.cancel()); // 既存をキャンセル
    activeAnimations.clear(); // Mapをクリア

    componentIds.forEach((id) => {
      createAndAnimateEternalPingPong(id);
      setupDatasheetEvents(id); // データシートイベントも再設定
    });
    console.log("アニメーションを初期化または更新しました。");
  }

  /** アニメーションのタイミング(Duration)のみを更新 */
  function updateAnimationTimings() {
    activeAnimations.forEach((animation, id) => {
      if (animation && typeof animation.effect?.updateTiming === "function") {
        const newDuration = getAnimationDuration(id); // 内部で吹き出しも更新
        try {
          animation.effect.updateTiming({ duration: newDuration });
        } catch (e) {
          console.warn(`タイミング更新エラー (${id}):`, e);
          createAndAnimateEternalPingPong(id); // エラー時は再作成
        }
      } else {
        console.warn(`無効なアニメーション (${id})。再作成します。`);
        createAndAnimateEternalPingPong(id); // 無効な場合も再作成
      }
    });
    updateSliderDisplay(); // スライダー表示も更新
  }

  // --- データシート表示関連 ---

  /** データシートを表示 */
  function showDatasheet(componentId, event) {
    const data = componentData[componentId];
    if (!data || !datasheetDiv) return;

    datasheetDiv.innerHTML = `
        <h4>${data.name}</h4>
        <p><strong>容量目安:</strong> ${data.size || "N/A"}</p>
        <p><strong>レイテンシ目安:</strong> ${data.latency || "N/A"}</p>
        <p><strong>帯域幅目安:</strong> ${data.bandwidth || "N/A"}</p>
    `;

    const offsetX = 15;
    const offsetY = 10;
    let top = event.pageY + offsetY;
    let left = event.pageX + offsetX;

    datasheetDiv.style.display = "block"; // 先に表示してサイズ計算
    const dsRect = datasheetDiv.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();

    if (left + dsRect.width > bodyRect.right - 20) {
      left = event.pageX - dsRect.width - offsetX;
    }
    if (top + dsRect.height > bodyRect.bottom - 20) {
      top = event.pageY - dsRect.height - offsetY;
    }
    // TODO: 左端、上端チェックも必要なら追加

    datasheetDiv.style.left = `${left}px`;
    datasheetDiv.style.top = `${top}px`;
  }

  /** データシートを非表示 */
  function hideDatasheet() {
    if (datasheetDiv) datasheetDiv.style.display = "none";
  }

  /** データシート表示用のイベントリスナーを設定 */
  function setupDatasheetEvents(componentId) {
    const componentElement = document.getElementById(componentId);
    if (componentElement) {
      componentElement.removeEventListener("mouseenter", handleMouseEnter); // 既存を削除
      componentElement.removeEventListener("mouseleave", hideDatasheet); // 既存を削除
      componentElement.addEventListener("mouseenter", handleMouseEnter);
      componentElement.addEventListener("mouseleave", hideDatasheet);
    }
  }
  // mouseenterのハンドラを別名にしてイベントオブジェクトを渡す
  function handleMouseEnter(event) {
    const componentId = event.target.id; // イベント発生元のIDを取得
    showDatasheet(componentId, event);
  }

  // --- UI更新関連 ---

  /** スライダーの値表示を更新 */
  function updateSliderDisplay() {
    const currentRawValue = parseFloat(speedSlider.value);
    const currentScale = getLogScaleFactor(currentRawValue);
    sliderValueDisplay.textContent = `現在のスケール: ${currentScale.toFixed(2)}x`;
  }

  /** Visualizationエリアの高さを調整 */
  function updateVisualizationHeight() {
    const headerHeight = document.querySelector("h1")?.offsetHeight || 0;
    const descriptionHeight = document.querySelector(".description")?.offsetHeight || 0;
    const controlsHeight = document.getElementById("controls")?.offsetHeight || 0;
    // 要素が存在しない場合も考慮してデフォルト値 0 を設定
    visualizationArea.style.height = `calc(100vh - ${
      headerHeight + descriptionHeight + controlsHeight + 60 // 60は適当なマージン
    }px)`;
  }

  // --- イベントリスナー設定 ---

  function setupEventListeners() {
    // スライダー (input)
    speedSlider.addEventListener("input", () => {
      updateAnimationTimings(); // タイミング更新（内部で表示も更新）
    });

    // スライダー (wheel)
    speedSlider.addEventListener("wheel", (e) => {
      e.preventDefault();
      const currentRawValue = parseFloat(speedSlider.value);
      const delta = (e.deltaY > 0 ? 1 : -1) * (e.shiftKey ? 10 : 1);
      const newRawValue = Math.max(MIN_RAW_SLIDER, Math.min(MAX_RAW_SLIDER, currentRawValue + delta));
      speedSlider.value = newRawValue;
      speedSlider.dispatchEvent(new Event("input")); // inputイベントを発火
    });

    // 現実速度チェックボックス
    realisticSpeedCheckbox.addEventListener("change", () => {
      console.log("現実速度モード変更:", realisticSpeedCheckbox.checked);
      updateAnimationTimings(); // チェックボックス変更時もタイミング更新
    });

    // ウィンドウリサイズ
    window.addEventListener("resize", () => {
      updateVisualizationHeight();
      // アニメーションはタイミング更新だけで良い場合が多いが、
      // 位置ずれが気になるなら initializeOrUpdateAnimations() を呼ぶ
      updateAnimationTimings();
      // initializeOrUpdateAnimations(); // 位置ずれが気になる場合
    });
  }

  // --- 初期化処理 ---

  function init() {
    // スライダーの初期値を設定
    speedSlider.value = getSliderValueForScale(INITIAL_SCALE);

    // 初期表示
    updateVisualizationHeight();
    updateSliderDisplay(); // 初期スケール表示

    // イベントリスナー設定
    setupEventListeners();

    // アニメーション開始 (少し遅延させてレイアウト計算を待つ)
    setTimeout(() => {
      initializeOrUpdateAnimations();
    }, 150);
  }

  // 初期化実行
  init();
});
