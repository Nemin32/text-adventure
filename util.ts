
type Msg = {type: "msg", msg: string} | {type: "divider"} | {type: "bold", msg: string}

let msgs: Msg[] = []

window.addEventListener("load", () => {
  const output = document.getElementById("output")

  if (output === null) {
    alert("For some reason the game isn't able to communicate with the page. Please tell Nemin.")
    return;
  }

  setInterval(() => {
    if (msgs.length > 0) {
      //console.log(msgs[0])

      if (msgs[0].type === "divider") {
        output.appendChild(document.createElement("hr"))
      } else {
        const p = document.createElement("pre")

        if (msgs[0].type === "bold") {
          p.style.fontWeight = "bold";
        }

        p.innerText = msgs[0].msg
        output.appendChild(p)
      }

      output.scrollTop = output.scrollHeight

      msgs = msgs.slice(1)
    }
  }, 200)

})

export function show(str: string, bold = false) {
  //console.log(str)
  msgs = [...msgs, ...str.split("\n").map<Msg>(s => ({type: bold ? "bold" : "msg", msg: s})), {type: "divider"}]
}
