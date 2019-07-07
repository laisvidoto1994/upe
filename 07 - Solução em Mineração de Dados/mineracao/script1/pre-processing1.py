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
from sklearn.preprocessing import MinMaxScaler
from pandas import read_csv


#definindo os nomes de cada coluna
names = ['preg', 'plas', 'pres', 'skin', 'test',
         'mass', 'pedi', 'age', 'class']

#Fazendo o carregamento dos dados diretamente do UCI Machine Learning
dataframe = read_csv('pima-indians-diabetes.csv', names=names)

print("Dados originais")
print(dataframe.head(5))

#separa os dados de entrada e saida
array = dataframe.values
X = array[:,0:8] #separa os dados da primeira coluna (0) ate a penultima (8)
Y = array[:,8] #separa os dados da ultima coluna

#realiza a re-escala dos dados
scaler = MinMaxScaler(feature_range=(0, 1))
rescaledX = scaler.fit_transform(X)

print("Resumo dos dados modificados")
numpy.set_printoptions(precision=3)
print(rescaledX[0:5,:])