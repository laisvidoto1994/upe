#Universidade de Pernambuco (UPE)
#Escola Politecnica de Pernambuco (Poli)
#Curso de Especializacao em Ciencia dos Dados e Analytics
#Disciplina de Solucoes em Mineracao de dados
#--------------------------------------------------------
#Script para a binarizacao de dados
#--------------------------------------------------------


# Importando as bibliotecas necessarias
import pandas
import numpy
from sklearn.preprocessing import Binarizer

#definindo os nomes de cada coluna
names = ['preg', 'plas', 'pres', 'skin', 'test', 'mass', 'pedi', 'age', 'class']

#Fazendo o carregamento dos dados diretamente do UCI Machine Learning          
dataframe = pandas.read_csv('pima-indians-diabetes.csv', names=names)

print("Dados originais")
print(dataframe.head(5))

#separa os dados de entrada e saida
array = dataframe.values
X = array[:,0:8] #separa os dados da primeira coluna (0) ate a penultima (8)
Y = array[:,8] #separa os dados da ultima coluna

binarizer = Binarizer(threshold=0.0).fit(X)
binaryX = binarizer.transform(X)

print("Resumo dos dados modificados")
numpy.set_printoptions(precision=3)
print(binaryX[0:5,:])
