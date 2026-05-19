# Padrões de Testes

## Obrigatório

- Toda função nova tem ao menos um teste unitário
- Todo bug corrigido tem um teste de regressão
- Coverage mínimo: 70% em código novo

## Nomenclatura

- `should [comportamento esperado] when [condição]`
- Exemplo: `should return 404 when user does not exist`

## Estrutura (AAA)

1. **Arrange**: configure o estado inicial
2. **Act**: execute a ação sendo testada
3. **Assert**: verifique o resultado

## Proibido em testes

- Chamadas reais a APIs externas (use mocks)
- Dependência de ordem de execução entre testes
- Testes que demoram mais de 5 segundos
