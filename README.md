# 🕒 calculadora-de-horas

📍 **Acesse online:** [https://calculadora-de-horas.rennan-alves.com](https://calculadora-de-horas.rennan-alves.com)

Uma calculadora de horas desenvolvida em **React** com foco em simplicidade e usabilidade. Ideal para contextos em que é necessário controlar ou ajustar horários, como o acompanhamento de carga horária em estágios, trabalho ou estudos.

## ✨ Funcionalidades

- Adição e subtração de horários no formato `hh:mm`
- Lógica personalizada para subtração que considera **avanço ou retrocesso de dias**
- Validação de entradas para evitar horários inválidos
- Histórico com os **últimos 5 cálculos realizados**
- Interface animada com **Framer Motion** e **ícones com Lucide**

## 🧠 Lógica Especial de Subtração

Ao subtrair horários, se o segundo horário for maior que o primeiro (por exemplo, `10:30 - 12:30`), a aplicação interpreta que o cálculo está sendo feito considerando **o primeiro horário no dia seguinte**. Isso retorna um resultado como `22:00`.

> 📝 **Motivação:** Essa lógica foi criada para uso em um contexto real de estágio, onde era necessário contabilizar tempo entre pausas para faculdade e retorno ao trabalho, respeitando o total da jornada diária.


## 🖼️ Interface

A interface foi construída com componentes reutilizáveis e estilizada com classes utilitárias. Os principais elementos da UI são:

- Inputs para inserir horas e minutos de dois horários distintos
- Botões para somar, subtrair e limpar entradas
- Exibição clara do resultado formatado
- Lista de histórico com possibilidade de remoção individual de itens

## 🚀 Tecnologias Utilizadas

- [React](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com) 
- [Shadcn/UI](https://ui.shadcn.com/) 

### ✅ Requisitos

- [Node.js](https://nodejs.org/) versão 16 ou superior
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 📦 Como rodar localmente

1. Clone o repositório:

```bash
git clone https://github.com/rennan-dev/calculadora-de-horas
cd calculadora-de-horas
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o projeto:

```
npm run dev
```

4. Acesse http://localhost:5000

## 📄 Licença

Este projeto está licenciado sob os termos da [Licença MIT](./LICENSE).