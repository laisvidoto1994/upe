#Universidade de Pernambuco (UPE)
#Escola Politecnica de Pernambuco (Poli)
#Curso de Especializacao em Ciencia dos Dados e Analytics
#Disciplina de Solucoes em Mineracao de dados
#--------------------------------------------------------
#Script para re-escala de dados
#--------------------------------------------------------


# Importando as bibliotecas necessarias
import pandas
import scipy
import numpy

from pandas import read_csv

dataset = read_csv('pima-indians-diabetes.csv', header=None)

print("Apresentando o shape dos dados (dimenssoes)")
print(dataset.shape)

print("Conhecendo os dados estatisticos dos dados carregados (describe)")
print(dataset.describe())

print("Visualizando o conjunto inicial (head) dos dados, ou mais claramente"
		"os 20 primeiros registros (head(20))")
print(dataset.head(20))

print("Quantidade de pontos que possue 0 como valor")
print((dataset[[1,2,3,4,5]] == 0).sum())

# Marcar os valores ausentes como NaN
dataset[[1,2,3,4,5]] = dataset[[1,2,3,4,5]].replace(0, numpy.NaN)

print("Realiza a contagem de valores NaN em cada coluna")
print(dataset.isnull().sum())

print("Visualizando o conjunto inicial (head) dos dados, ou mais claramente"
		"os 20 primeiros registros (head(20))")
print(dataset.head(20)) 

# Removendo registros que possuem valores ausentes (NaN)
dataset.dropna(inplace=True)
print("Apresentando o shape dos dados (dimenssoes)")
print(dataset.shape)

# Preenchendo os valores ausentes com base na media dos valores da coluna
# existe ainda as opcoes via mediana e valores mais frequentes
dataset.fillna(dataset.mean(), inplace=True)
print("Mostra a quantidade de valores ausentes (NaN) de cada coluna")
print(dataset.isnull().sum())
print(dataset.shape)

print("Visualizando o conjunto inicial (head) dos dados, ou mais claramente"
		"os 20 primeiros registros (head(20))")
print(dataset.head(20))