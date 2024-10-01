import React, { useState, ChangeEvent } from 'react';
import './App.css'; // Importa o arquivo de estilo externo

// Definição dos tipos para os grupos e inputs
interface InputValues {
  [key: string]: string;
}

interface InputConfig {
  label: string;
  type: string;
}

interface Group {
  id: number;
  name: string; // Adiciona um campo para o nome do grupo
  inputs: InputConfig[]; // Atualiza para usar a nova configuração de input
  values: InputValues;
}

function App() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [jsonResult, setJsonResult] = useState<string>('');

  // Função para adicionar um novo grupo de inputs
  const addGroup = () => {
    const newGroup: Group = {
      id: groups.length + 1,
      name: `Grupo ${groups.length + 1}`, // Nome padrão para o novo grupo
      inputs: [],
      values: {},
    };
    setGroups([...groups, newGroup]);
  };

  // Função para adicionar um novo input a um grupo específico
  const addInputToGroup = (groupId: number) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          const newInput: InputConfig = {
            label: `Campo ${group.inputs.length + 1}`,
            type: 'text', // Tipo padrão para novos inputs
          };
          return { ...group, inputs: [...group.inputs, newInput] };
        }
        return group;
      })
    );
  };

  // Função para lidar com as mudanças nos inputs de um grupo específico
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, groupId: number, index: number) => {
    const value = e.target.value;
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return { ...group, values: { ...group.values, [index]: value } };
        }
        return group;
      })
    );
  };

  // Função para modificar o nome do grupo
  const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>, groupId: number) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return { ...group, name: e.target.value };
        }
        return group;
      })
    );
  };

  // Função para modificar o label e o tipo do input
  const handleInputConfigChange = (e: ChangeEvent<HTMLInputElement>, groupId: number, index: number, field: 'label' | 'type') => {
    const value = e.target.value;
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          const updatedInputs = [...group.inputs];
          updatedInputs[index] = {
            ...updatedInputs[index],
            [field]: value,
          };
          return { ...group, inputs: updatedInputs };
        }
        return group;
      })
    );
  };

  // Função para remover um input específico de um grupo
  const removeInputFromGroup = (groupId: number, index: number) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          const updatedValues = { ...group.values };
          delete updatedValues[index];
          return { ...group, inputs: group.inputs.filter((_, i) => i !== index), values: updatedValues };
        }
        return group;
      })
    );
  };

  // Função para remover um grupo inteiro
  const removeGroup = (groupId: number) => {
    setGroups(groups.filter((group) => group.id !== groupId));
  };

  // Função para transformar os valores dos grupos em JSON
  const generateJson = () => {
    const jsonArray = groups.map((group) => {
      const groupValues = {};
      group.inputs.forEach((input, index) => {
        groupValues[input.label] = group.values[index];
      });
      return groupValues;
    });
    setJsonResult(JSON.stringify(jsonArray, null, 2));
  };

  return (
    <div className="container">
      <div className="app">
        <h2>Adicionar Grupos de Inputs Dinamicamente</h2>
        <button className="add-group" onClick={addGroup}>
          Adicionar Novo Grupo
        </button>

        {/* Renderiza os grupos de inputs adicionados */}
        {groups.map((group) => (
          <div key={group.id} className="group-container">
            <h3>Grupo {group.id}</h3>
            <input
              type="text"
              value={group.name}
              onChange={(e) => handleGroupNameChange(e, group.id)}
              className="group-name-input"
            />
            <button className="add-input" onClick={() => addInputToGroup(group.id)}>
              Adicionar Novo Campo ao Grupo {group.id}
            </button>
            <button className="remove-group" onClick={() => removeGroup(group.id)}>
              Remover Grupo {group.id}
            </button>

            {/* Renderiza os inputs de cada grupo */}
            <div>
              {group.inputs.map((input, index) => (
                <div key={index} className="input-container">
                  <input
                    type="text"
                    value={input.label}
                    onChange={(e) => handleInputConfigChange(e, group.id, index, 'label')}
                    placeholder="Nome do Campo"
                  />
                  <select
                    value={input.type}
                    onChange={(e) => handleInputConfigChange(e, group.id, index, 'type')}
                  >
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="email">Email</option>
                    <option value="tel">Telefone</option>
                    <option value="date">Data</option>
                  </select>
                  <input
                    type={input.type}
                    value={group.values[index] || ''}
                    onChange={(e) => handleInputChange(e, group.id, index)}
                  />
                  <button className="remove-input" onClick={() => removeInputFromGroup(group.id, index)}>
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Botão para gerar o JSON */}
        <button className="generate-json" onClick={generateJson}>
          Gerar JSON
        </button>

        {/* Mostra os valores dos inputs dos grupos */}
        <div className="json-display">
          <h3>JSON Gerado:</h3>
          <pre>{jsonResult}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
