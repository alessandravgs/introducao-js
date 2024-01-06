const baseUrl2 = "http://localhost:3000";

const cursoModal = document.querySelector("#curso-modal");
const listaCursoModal = document.querySelector(".curso-list");
const cursoModalTitle = document.querySelector("#curso-modal-title");
const saveCursoButton = document.querySelector("#save-curso");
const cursoForm = document.querySelector("#curso-form");

const openCursoModal = () => cursoModal.showModal();
const closeCursoModal = () => cursoModal.close();

const clearModalCursos = () =>{

  const campo1 = document.getElementById('nomeCurso');

  campo1.value = '';
}

const createCurso = () => {
  cursoModalTitle.innerHTML = "Novo Curso";
  saveCursoButton.innerHTML = "Criar";
  openCursoModal();
  SaveCurso(`${baseUrl2}/cursos`, "POST");
};

const createCursoDiv = (id, title, alunos, disciplinas) => {
    const divCurso = document.createElement("div");
    const tableIdAluno = `table_${title.trim().replace(/\s+/g, '')}Aluno`;
    const tableIdDisciplina = `table_${title.trim().replace(/\s+/g, '')}Disciplina`;
    divCurso.innerHTML = `
        <div class="curso-card">
            <h3 class="curso-card__title">${title}</h3>
            <hr />
            <div align="center">
            <h4>Alunos</h4>
            <br>
                <table id="${tableIdAluno}" class="table table--stripe">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                        </tr>
                    </thead>
                    <tbody id="${tableIdAluno}_row">
                    </tbody>
                </table>
                <br>

                <h4>Disciplinas</h4>
                <br>
                    <table id="${tableIdDisciplina}" class="table table--stripe">
                        <thead>
                            <tr>
                                <th>Nome Disciplina</th>
                                <th>Carga Horária</th>
                                <th>Professor</th>
                            </tr>
                        </thead>
                        <tbody id="${tableIdDisciplina}_row">
                        </tbody>
                    </table>
                <br>

                <hr />
                <button class="button button--danger" onclick="deleteCurso(${id}, '${title}')">Apagar</button>
                <button class="button button--success" onclick="editCurso(${id}, '${title}')">Editar</button>
            </div>
        </div>
    `;

    listaCursoModal.appendChild(divCurso);

    const tbodyRowAluno = document.querySelector(`#${tableIdAluno}_row`);

    listarAlunos(alunos, tbodyRowAluno);

    const tbodyRowDisciplina = document.querySelector(`#${tableIdDisciplina}_row`);

    listarDisciplinas(disciplinas, tbodyRowDisciplina);
};



const listarAlunos = (alunos, tbody) => {
    for (const aluno of alunos) {
        const tableTr = document.createElement("tr");
        tableTr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.matricula}</td>`;
        tbody.appendChild(tableTr);
    }
};

const listarDisciplinas = (disciplinas, tbody) => {
    for (const disciplina of disciplinas) {
        const tableTr = document.createElement("tr");
        tableTr.innerHTML = `
            <td>${disciplina.nome}</td>
            <td>${disciplina.cargaHoraria}</td>
            <td>${disciplina.professor}</td>`;
        tbody.appendChild(tableTr);
    }
};

const editCurso = async (id, title) => {
    try
    {
        const alunos = await getAlunosDoCurso(title);
        const disciplinas = await getDisciplinasPorCurso(title);

        if(alunos.length > 0 || disciplinas.length > 0)
        {
            alert("Não é possível editar cursos com alunos ou disciplinas cadastradas.");
            return;
        }

        const response = await fetch(`http://localhost:3000/cursos/${id}`);
        const cursoEdit = await response.json();
        const {nomeCurso} = cursoEdit;

        cursoModalTitle.innerHTML = `Editar Curso ${nomeCurso}`;
        document.querySelector("#nomeCurso").value = nomeCurso;
        saveCursoButton.innerHTML = "Salvar";

        await openCursoModal();
        SaveCurso(`${baseUrl2}/cursos/${id}`, "PUT");
    }
    catch(error){
        alert("Ocorreu um erro. Tente mais tarde.");
        console.error(error);
    }

    loadCursos1();
};


const SaveCurso = (url, method) => {
    cursoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(cursoForm);
        const payload = new URLSearchParams(formData);

        fetch(url, {
            method: method,
            body: payload,
        }).catch((error) => {
            alert("Ocorreu um erro, tente novamente mais tarde.");
            console.error(error);
        })

        closeCursoModal();
        clearModalCursos();
        loadCursos1();
    })
};


const deleteCurso = async (id, title) => {
    try
    {
        const alunos = await getAlunosDoCurso(title);
        const disciplinas = await getDisciplinasPorCurso(title);

        if(alunos.length > 0 || disciplinas.length > 0)
        {
            alert("Não é possível excluir cursos com alunos ou disciplinas cadastradas.");
            return;
        }

        fetch(`${baseUrl2}/cursos/${id}`, {
          method: "DELETE",
        }).catch((error) => {
          alert("Ocorreu um erro. Tente mais tarde.");
          console.error(error);
        });

    }
    catch(error){
        alert("Ocorreu um erro. Tente mais tarde.");
        console.error(error);
    }
  
    loadCursos1();
};

async function loadCursos1() {
    try {
        const response = await fetch("http://localhost:3000/cursos");
        const cursos = await response.json();
        listaCursoModal.innerHTML = "";

        for (const curso of cursos) {
            const alunos = await getAlunosDoCurso(curso.nomeCurso);
            const disciplinas = await getDisciplinasPorCurso(curso.nomeCurso);
            createCursoDiv(curso.id, curso.nomeCurso, alunos, disciplinas);  
        }
    } catch (error) {
        alert("Ocorreu um erro. Tente mais tarde.");
        console.error(error);
    }
};


const loadCursos = () => {
    fetch("http://localhost:3000/cursos")
      .then((resp) => resp.json())
      .then((data) => {
        listaCursoModal.innerHTML = "";
        data.forEach((curso) => {
          const alunos = getAlunosDoCurso(curso.nomeCurso);
          const disciplinas = getDisciplinasPorCurso(curso.nomeCurso);
          createCursoDiv(curso.id, curso.nomeCurso, alunos, disciplinas);  

        });
      })
      .catch((error) => {
        alert("Ocorreu um erro. Tente mais tarde.");
        console.error(error);
      });
};


const getAlunosDoCurso = (nomeCurso) => {
    return fetch(`http://localhost:3000/alunos?curso=${nomeCurso}`)
        .then((resp) => resp.json())
        .then((data) => {
            const listaAlunos = data.map(aluno => ({ nome: aluno.nome, matricula: aluno.matricula }));
            return listaAlunos;
        })
        .catch((error) => {
            console.error("Erro ao obter alunos do curso:", error);
            return [];
        });
};

const getDisciplinasPorCurso = (nomeCurso) => {
    return fetch('http://localhost:3000/disciplinas')
        .then(response => response.json())
        .then(data => {
            const disciplinasDoCurso = data.filter(disciplina => {
                return disciplina.cursoDisciplina.includes(nomeCurso);
            });
            const disciplinas = disciplinasDoCurso.map(d => ({ nome: d.nomeDisciplina, cargaHoraria: d.cargaHoraria, professor: d.professor }));
            return disciplinas;
        })
        .catch(error => {
            console.error('Erro ao obter disciplinas:', error);
            return [];
        });
}
   
loadCursos1();