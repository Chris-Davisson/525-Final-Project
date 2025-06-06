const processList = document.getElementById("processList");

function updateList() {
  chrome.runtime.sendMessage("getProcesses", (processes) => {
    if (!processes || Object.keys(processes).length === 0) {
      processList.innerHTML = "<li>No process data available</li>";
      return;
    }

    processList.innerHTML = "";
    // let totalCpu = 0, totalMem = 0, totalNet = 0;
    // for (const proc of Object.values(processes)) {
    //   if (proc.cpu !== "N/A") totalCpu += parseFloat(proc.cpu) || 0;
    //   if (proc.memory !== "N/A") totalMem += parseFloat(proc.memory) || 0;
    //   if (proc.network !== "N/A") totalNet += parseFloat(proc.network) || 0;
    // }
    // console.log("Total CPU:", totalCpu, "Total Memory:", totalMem, "Total Network:", totalNet);
    for (const [pid, proc] of Object.entries(processes)) {
      const li = document.createElement("li");
      // console.log(proc);
      // console.log("here");
      
      

      // const cpuPercent = (proc.cpu !== "N/A" && totalCpu > 0) ? (parseFloat(proc.cpu) / totalCpu) : 0;
      // const memPercent = (proc.memory !== "N/A" && totalMem > 0) ? (parseFloat(proc.memory) / totalMem) : 0;
      // const netPercent = (proc.network !== "N/A" && totalNet > 0) ? (parseFloat(proc.network) / totalNet) : 0;

      // console.log(`PID: ${pid}, CPU: ${proc.cpu}, Memory: ${proc.memory}, Network: ${proc.network}`);
      

      // const r = Math.round(cpuPercent * 255);
      // const g = Math.round(memPercent * 255);
      // const b = Math.round(netPercent * 255);

      // li.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      
      // HTML for side panel
      li.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="pid"><strong>PID:</strong> ${pid}</div>
            <div class="cpu-section"><strong>CPU:</strong> ${proc.cpu}%</div>
            <div class="memory-section"><strong>Mem:</strong> ${proc.memory} MB</div>
            <div class="network-section"><strong>Net:</strong> ${proc.network} KB/s</div>
          </div>
          <button class="kill-btn" data-pid="${pid}">Kill</button>
        </div>
      `;

      processList.appendChild(li);
    }
  });
}

// Delegate click on any Kill button
processList.addEventListener("click", (e) => {
  console.log("This does nothing right now, I keep getting blocked");
});


updateList();
setInterval(updateList, 1000);
