const baseUrl1 = "http://localhost:3000";

const disciplinaModal = document.querySelector("#disciplina-modal");
const listaDisciplinaModal = document.querySelector(".subject-list");
const disciplinaModalTitle = document.querySelector("#disciplina-modal-title");
const saveDisciplinaButton = document.querySelector("#save-disciplina");
const disciplinaForm = document.querySelector("#disciplina-form");
const cursoSelection1 = document.querySelector("#cursoDisciplina");


const openDisciplinaModal = () => {
  loadCursos1();
  disciplinaModal.showModal();
};
const closeDisciplinaModal = () => disciplinaModal.close();

const clearModalDisciplinas = () =>{

  const campo1 = document.getElementById('nomeDisciplina');
  const campo2 = document.getElementById('cargaHoraria');
  const campo3 = document.getElementById('professor');
  const campo4 = document.getElementById('observacoes');
  const campo5 = document.getElementById('status');

  campo1.value = '';
  campo2.value = '';
  campo3.value = '';
  campo4.value = '';
  campo5.value = '';
}

const listarCursos1 = (nomeCurso) => {
  const optionCurso = document.createElement("option");
  optionCurso.innerHTML = `<option value="${nomeCurso}">${nomeCurso}</option>`;
  //console.log(optionCurso);
  //console.log(cursoSelection1);
  cursoSelection1.appendChild(optionCurso);
};

const loadCursos1 = async () => {
  
  try
  {
    const response = await fetch("http://localhost:3000/cursos");
    const cursos = await response.json();
    cursoSelection1.innerHTML = ``;
    cursos.forEach((curso) => {
      listarCursos1(curso.nomeCurso);
    })

  }
  catch(error){
    alert("Erro ao consultar os cursos.");
    console.error(error);
  }
};

const createDisciplina = () => {
  disciplinaModalTitle.innerHTML = "Nova Disciplina";
  saveDisciplinaButton.innerHTML = "Criar";
  openDisciplinaModal();
  SaveDisciplina(`${baseUrl1}/disciplinas`, "POST");
};

const createDisciplinaDivRow = (id, title, carga, professor, status, descricao) =>{
    const divDisciplina  = document.createElement("div");
    divDisciplina.innerHTML = `
    <div class="subject-card">
          <h3 class="subject-card__title">${title}</h3>
          <hr />
          <ul class="subject-card__list">
            <li>Carga horária: ${carga}</li>
            <li>Professor: ${professor}</li>
            <li>Status: <span class="tag ${selectTag(status)}">${status}</span></li>
          </ul>
          <p>${descricao}</p>

          <div align="center">
            <br><hr />
            <button class="button button--danger" onclick="deleteDisciplina(${id})">Apagar</button>
            <button class="button button--success" onclick="editDisciplina(${id})"}>Editar</button>
          </div>
    </div>
    `;

    listaDisciplinaModal.appendChild(divDisciplina);
};

const selectTag = (status) =>{
  if(status === "Obrigatória")
    return "tag--danger"
  else 
    return "tag--success"
};

const editDisciplina = (id) => {
  console.log(id)
    fetch(`${baseUrl1}/disciplinas/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        const { nomeDisciplina, cargaHoraria, professor, status, observacoes} = data;
        disciplinaModalTitle.innerHTML = `Editar Disciplina ${nomeDisciplina}`;
        document.querySelector("#nomeDisciplina").value = nomeDisciplina;
        document.querySelector("#cargaHoraria").value = cargaHoraria;
        document.querySelector("#professor").value = professor;
        document.querySelector("#observacoes").value = observacoes;
        document.querySelector("#status").value = status;              

        saveDisciplinaButton.innerHTML = "Salvar";
        openDisciplinaModal();
        SaveDisciplina(`${baseUrl1}/disciplinas/${id}`, "PUT");
      })
      .catch((error) => {
        alert("Ocorreu um erro. Tente mais tarde.");
        console.error(error);
      });
  };

const SaveDisciplina = (url, method) => {
    disciplinaForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(disciplinaForm);
        const payload = new URLSearchParams(formData);

        fetch(url, {
            method: method,
            body: payload,
        }).catch((error) => {
            alert("Ocorreu um erro, tente novamente mais tarde.");
            console.error(error);
        })

        closeDisciplinaModal();
        clearModalDisciplinas();
        loadDisciplina();
    })
};


const deleteDisciplina = (id) => {
    fetch(`${baseUrl1}/disciplinas/${id}`, {
      method: "DELETE",
    }).catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
  
    loadDisciplina();
};

const loadDisciplina = () => {
    fetch("http://localhost:3000/disciplinas")
      .then((resp) => resp.json())
      .then((data) => {
        listaDisciplinaModal.innerHTML = "";
        data.forEach((disciplina) => {
          createDisciplinaDivRow(
            disciplina.id,
            disciplina.nomeDisciplina,
            disciplina.cargaHoraria,
            disciplina.professor,
            disciplina.status,
            disciplina.observacoes,
          );
        });
      })
      .catch((error) => {
        alert("Ocorreu um erro. Tente mais tarde.");
        console.error(error);
      });
  };

  loadDisciplina();