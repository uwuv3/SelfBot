
const wrapper = document.getElementById("bubble-wrapper");

const animateBubble = x => {
  const bubble = document.createElement("div");

  bubble.className = "bubble";
  bubble.style.left = `${x}px`;

  document.getElementById("bubble-wrapper").appendChild(bubble);

  setTimeout(() => document.getElementById("bubble-wrapper").removeChild(bubble), 2000);
}
window.onmousemove = e => animateBubble(e.clientX)
