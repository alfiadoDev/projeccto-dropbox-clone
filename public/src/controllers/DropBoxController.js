class DropBoxController{

    constructor(){

        this.btnSendFileEl = document.getElementById("btn-send-file");
        this.inputFilesEl = document.getElementById("files");
        this.snackModalEl = document.getElementById("react-snackbar-root");
        this.progressBarEl = this.snackModalEl.querySelector(".mc-progress-bar-fg");
        this.fileNameEl = this.snackModalEl.querySelector(".filename");
        this.timeLeftFileEl = this.snackModalEl.querySelector(".timeleft");

        this.initEvents();
    }

    initEvents(){

        this.btnSendFileEl.addEventListener("click", event=>{

            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener("change", event =>{
            this.uploadTask(event.target.files);
            this.modalShowOrHideProgress();
            this.inputFilesEl.value = "";
        });

    }

    modalShowOrHideProgress(show = true){
        this.snackModalEl.style.display = (show)? "block":"none";
    }

    uploadTask(files){

        let promises = [];

        [...files].forEach(file=>{

            promises.push(new Promise((resolve, reject)=>{

                let ajax = new XMLHttpRequest();
                ajax.open("POST","/upload");

                ajax.onload = event =>{
                    this.modalShowOrHideProgress(false);
                    try {
                        resolve(JSON.parse(ajax.responseText));
                    } catch (error) {
                        reject(error);
                    }
                };

                ajax.onerror = event =>{
                    this.modalShowOrHideProgress(false);
                    reject(event);
                };

                ajax.upload.onprogress = event=>{
                    this.uploadProgress(event, file);
                };

                //para enviar arquivos podemos usar o formData para ler os arquivos e enviar por ajax
                let formData = new FormData();
                formData.append('input-file',file);

                this.startUploadTime = Date.now();

                ajax.send(formData);

            }));

        });

        return Promise.all(promises);
    }

    uploadProgress(event, file){
        let timeSpent = Date.now() - this.startUploadTime;
        let percent = parseInt((event.loaded/event.total)*100);
        this.progressBarEl.style.width = `${percent}%`;
        this.fileNameEl.innerHTML = file.name;

        let timeLeft = ((100-percent)*timeSpent)/percent;

        this.timeLeftFileEl.innerHTML = this.formatTimeToHuman(timeLeft);

    }

    formatTimeToHuman(duration){
        
        let secounds = parseInt((duration/1000) % 60);
        let minutes = parseInt((duration/(1000 * 60)) % 60);
        let hours = parseInt((duration/(1000 * 60 * 60)) % 24);

        if(hours>0){
            return `${hours} horas, ${minutes} minuntos, ${secounds} segundos`;
        }
        if(minutes>0){
            return `${minutes} minuntos, ${secounds} segundos`;
        }
        if(secounds>0){
            return `${secounds} segundos`;
        }
        return "";
    }
}