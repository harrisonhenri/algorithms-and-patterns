---
tags: [typescript, theory]
title: "Types vs interfaces"
---
# Types vs Interfaces

## Definição resumida (o que cada um é)

**`type` (type alias)**

- É um **nome para qualquer tipo** (primitivo, objeto, união, tupla, função, etc.).
- Serve para **alias** de tipos já existentes.
- Pode representar tipos avançados (uniões, intersections, mapeados, condicionais). ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))

**`interface`**

- Descreve **a forma (shape) de objetos e contratos**.
- É inspirada em **contratos de programação orientada a objetos** e funciona bem com classes (`implements`). ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))

---

## Principais diferenças

### 1) **Merge automático**

- `interface` permite **declaration merging**: várias declarações com o mesmo nome se combinam automaticamente. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))
- `type` **não** pode ser reaberto/redeclarado — dá erro de duplicação. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))

👉 Útil pra estender tipos de terceiros ou APIs globais, mas pode causar efeitos inesperados se usado sem cuidado.

### 2) **Capacidade de representar tipos avançados**

- `type` pode fazer:
    - **uniões** (`'a' | 'b'`)
    - **intersections** (`A & B`)
    - **tuplas**
    - **mapped/conditional types**
    - etc. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))
- `interface` **não** pode definir uniões nem muito desses tipos avançados. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))

👉 Isso torna `type` **mais expressivo** e flexível.

### 3) **Extensão / Herança**

- `interface` usa `extends`, e isso é mais **idiomático para contratos orientados a objetos** e para polimorfismo. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))
- `type` usa interpseção (`&`) para compor tipos, o que funciona diferente e pode gerar **erros sutis** se as propriedades conflitarem. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))

---

## Quando usar qual — regra prática

### 💡 Use `interface` quando:

- Você quer **um contrato aberto e extensível** (ex.: APIs públicas, objetos que podem crescer). ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))
- Você quer que outras partes do código **estendam ou mesclem** a definição. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))
- Você usa **classes** e quer que elas `implements` esse tipo.

👉 Exemplo típico: definir shape de objeto que muitos pacotes vão estender.

### 💡 Use `type` quando:

- Você precisa de **features avançadas** de tipos (uniões, condicionais, mapped types). ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))
- Você quer um tipo que **não deve ser mesclado por acidente**. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))
- Você está modelando **tipos complexos/derivados**, não só objetos.

👉 Exemplo: `type Event = 'click' | 'keydown'`.

---

## Resumo comparativo rápido

| Característica | `interface` | `type` |
| --- | --- | --- |
| Descrever objeto | ✅ | ✅ |
| Union types | ❌ | ✅ |
| Tuples | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| Extensível (merge/augment) | ✅ | ❌ |
| Funciona com mapped/conditional types | ❌ | ✅ |
| Inferência mais “explícita” em editor | às vezes 🤏 | às vezes 🤏 |

---

## Observações importantes

📍 **Ambos podem modelar objetos e funções** — muitas vezes você pode usar qualquer um. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))

📍 A escolha em grande parte é sobre **intenção e estilo**:

- Se você quer um **contrato que possa crescer**, use `interface`.
- Se você quer **um tipo fechado e forte**, use `type`. ([LogRocket Blog](https://blog.logrocket.com/types-vs-interfaces-typescript/?utm_source=chatgpt.com))

---

## Uma regra de ouro simples

> Use type por padrão para tipos “fechados” e avançados; use interface quando você quer um contrato aberto e extensível.
> 

Essa regra combina:

- a flexibilidade moderna do sistema de tipos TS
- e a semântica de contrato de `interface`
- incluindo o uso consciente de declaration merging quando faz sentido 👌
