
type Msg = {type: "msg", msg: string} | {type: "divider"} | {type: "command", msg: string}

let msgs: Msg[] = []

window.addEventListener("load", () => {
  const output = document.getElementById("output")

  if (output === null) {
    alert("For some reason the game isn't able to communicate with the page. Please tell Nemin.")
    return;
  }

  setInterval(() => {
    if (msgs.length > 0) {
      if (msgs[0].type === "divider") {
        output.appendChild(document.createElement("hr"))
      } else {
        const p = document.createElement("pre")

        if (msgs[0].type === "command") {
          p.classList.add("command")
        }

        p.innerHTML = msgs[0].msg
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replace(/\*(.*?)\*/g, "<span class='spec'>$1</span>")

        output.appendChild(p)
      }

      output.scrollTop = output.scrollHeight

      msgs = msgs.slice(1)
    }
  }, 200)

})

export function show(str: string, command = false) {
  //console.log(str)
  msgs = [...msgs, ...str.split("\n").map<Msg>(s => ({type: command ? "command" : "msg", msg: s})), {type: "divider"}]
}
