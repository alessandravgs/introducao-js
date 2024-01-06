// studentModal.open = true // funciona para abrir o dialog
// studentModal.open = false// funciona para fechar o dialog
// studentModal.setAttribute('open', true) // funciona para abrir o dialog
// studentModal.setAttribute('open', false) // não funciona para fechar o dialog
// studentModal.removeAttribute('open') funciona para fechar o dialog
// studentModal.showModal() // funciona para abrir o dialog
// studentModal.close() funciona para fechar o dialog

const baseUrl = "http://localhost:3000";

// Passo 1: Selecionar os elementos HTML necessários
const studentModal = document.querySelector("#student-modal");
const studentTable = document.querySelector("#student-table");
const tbody = studentTable.querySelector('tbody');
const studentForm = document.querySelector("#student-form");
const studentModalTitle = document.querySelector("#student-modal-title");
const saveStudentButton = document.querySelector("#save-student");
const cursoSelection = document.querySelector("#curso");
// studentModal.showModal()

// Passo 2: Definir função para abrir o modal do estudante
const openStudentModal = () => {
  loadCursos();
  studentModal.showModal();
};

const listarCursos = (nomeCurso) => {
  const optionCurso = document.createElement("option");
  optionCurso.innerHTML = `<option value="${nomeCurso}">${nomeCurso}</option>`;
  //console.log(optionCurso);
  //console.log(cursoSelection);
  cursoSelection.appendChild(optionCurso);
};

const loadCursos = async () => {
  
  try
  {
    const response = await fetch("http://localhost:3000/cursos");
    const cursos = await response.json();
    cursoSelection.innerHTML = `<option value="">Selecione</option>`;
    cursos.forEach((curso) => {
      listarCursos(curso.nomeCurso);
    })

  }
  catch(error){
    alert("Erro ao consultar os cursos.");
    console.error(error);
  }
};

const createStudent = () => {
  studentModalTitle.innerHTML = `Novo Aluno`;
  saveStudentButton.innerHTML = "Criar";
  openStudentModal();
  saveStundentData(`${baseUrl}/alunos`, "POST");
};

// Passo 3: Definir função para fechar o modal do estudante
const closeStudentModal = () => studentModal.close();

// Passo 4: Criar uma linha na tabela do estudante
const createStudentTableRow = (id, name, matricula, curso) => {
  const tableTr = document.createElement("tr");
  tableTr.innerHTML = `
    <td>${name}</td>
    <td>${matricula}</td>
    <td>${curso}</td>
    <td align="center">
      <button class="button button--danger" onclick="deleteStudentTable(${id})">Apagar</button>
      <button class="button button--success" onclick="editdStudentModal(${id})"}>Editar</button>
    </td>`;
    tbody.appendChild(tableTr);
};

const saveStundentData = (url, method) => {
  studentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // capturar os dados do formulário
    const formData = new FormData(studentForm);
    // transformar os dados do formulário em um objeto
    const payload = new URLSearchParams(formData);
    fetch(url, {
      method: method,
      body: payload,
    }).catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });

    closeStudentModal();
    clearModal();
    loadStudentTable();
  });
};

// Passo 7: Abrir o modal para criar um novo aluno
// Passo 8: Excluir um aluno da tabela
const deleteStudentTable = (id) => {
  fetch(`${baseUrl}/alunos/${id}`, {
    method: "DELETE",
  }).catch((error) => {
    alert("Ocorreu um erro. Tente mais tarde.");
    console.error(error);
  });

  loadStudentTable();
};

// Passo 9: Abrir o modal de edição e carregar os dados do aluno
const editdStudentModal = (id) => {
  fetch(`${baseUrl}/alunos/${id}`)
    .then((resp) => resp.json())
    .then((data) => {
      const { nome, matricula, curso } = data;
      studentModalTitle.innerHTML = `Editar Aluno ${nome}`;
      document.querySelector("#nome").value = nome;
      document.querySelector("#matricula").value = matricula;
      document.querySelector("#curso").value = curso;
      saveStudentButton.innerHTML = "Salvar";
      openStudentModal();
      saveStundentData(`${baseUrl}/alunos/${id}`, "PUT");
    })
    .catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
};

// Passo 10: Chamar a função para carregar dados iniciais da tabela ao carregar a página
//Opção 1
const loadStudentTable = async () => {
  try {
    const response = await fetch("http://localhost:3000/alunos");
    const data = await response.json();

    // Limpa o conteúdo atual da tabela
    tbody.innerHTML = "";

    // Adiciona as novas linhas
    data.forEach((student) => {
      createStudentTableRow(
        student.id,
        student.nome,
        student.matricula,
        student.curso
      );
    });
  } catch (error) {
    alert("Ocorreu um erro. Tente mais tarde.");
    console.error(error);
  }
};


//Opção 2
const loadStudentTable2 = () => {
  fetch("http://localhost:3000/alunos")
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((student) => {
        // pode ser feito assim também
        // const { nome, matricula, curso } = student;
        createStudentTableRow(
          student.id,
          student.nome,
          student.matricula,
          student.curso
        );
      });
    })
    .catch((error) => {
      alert("Ocorreu um erro. Tente mais tarde.");
      console.error(error);
    });
};

loadStudentTable();

const clearModal = () =>{

  const campo1 = document.getElementById('nome');
  const campo2 = document.getElementById('matricula');
  const campo3 = document.getElementById('curso');

  campo1.value = '';
  campo2.value = '';
  campo3.value = '';
}


