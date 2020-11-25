const gpu = new GPU();

function output(log) {
    var l = document.getElementById("log")
    console.log(log)
    l.innerHTML = log
}

function setSettings(framerate, res) {
    document.getElementById("framerate").value = framerate
    document.getElementById("resolution").value = res.trim()
}


function render() {
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')

    var frames = parseInt(document.getElementById("frames").value)
    var framerate = parseInt(document.getElementById("framerate").value)
    var resolution = document.getElementById("resolution").value

    output("loading information from settings")

    canvas.width = parseInt(resolution.split("x")[0])
    canvas.height = parseInt(resolution.split("x")[1])
    document.getElementById("video").style.display = "none"


    const gpu_render = gpu.createKernel(function(x) {
        this.color(Math.random(),Math.random(),Math.random(),1)
    })
      .setOutput([parseInt(resolution.split("x")[0]), parseInt(resolution.split("x")[1])])
      .setGraphical(true);

      output("set up gpu")

    var encoder = new Whammy.Video(framerate); 

    output("rendering frames")

    // update dom
    setTimeout(()=>{
        for(let i = 0;i<frames;i++) {
            gpu_render([0])
    
            var render_canvas = gpu_render.canvas
    
            ctx.drawImage(render_canvas, 0, 0)
    
            encoder.add(ctx)
        }
    
        canvas.width=0
        canvas.height=0
    
        output("encoding frames")
    
        encoder.compile(false, (_output)=>{
            output("")
            document.getElementById("video").src = (window.webkitURL || window.URL).createObjectURL(_output)
            document.getElementById("video").style.display = "block"
        });
    }, 0)
    
}

