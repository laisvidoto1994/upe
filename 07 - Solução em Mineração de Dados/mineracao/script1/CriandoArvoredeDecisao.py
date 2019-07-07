# -*- coding: utf-8 -*-
"""
Created on Sat Jul  6 10:34:44 2019

Criando arvore de decisão

@author: pos
"""
import numpy as np
from sklearn import datasets
from sklearn import tree

# Load iris
iris = datasets.load_iris()
X = iris.data
y = iris.target

# Constroi um classificador com arvore de decisao
dt = tree.DecisionTreeClassifier(criterion='entropy')
#criando a arvore
dt.fit(X, y)

print("valores de x")
print(X)
print(" ---------------- ")
print("valores de y")
print(y)

#criando arquivo do tipo .dot(dotfile)
dotfile = open("dados-iris.dot", 'w')
tree.export_graphviz(dt, out_file=dotfile, feature_names=iris.feature_names)
#passando os dados encontrados para esse arquivo e o salvando no mesmo diretorio onde esse arquivo esta instalado
dotfile.close()
print("Arvore de decisao gerada no diretorio com o nome que foi informado acima!")