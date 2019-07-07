# -*- coding: utf-8 -*-
"""
Created on Sat Jul  6 16:39:54 2019

@author: pos
"""

import numpy as np
from sklearn import datasets
from sklearn import tree
from pandas import read_csv
from sklearn import preprocessing
     
dataset = read_csv("bank-additional.csv",header=0,sep=";")

print( dataset.shape )
print( dataset.dtypes ) 
print( dataset.head() )
    
le = preprocessing.LabelEncoder()

for column_name in dataset.columns:
    if dataset[column_name].dtype == object:
        dataset[column_name] = le.fit_transform( dataset[column_name] )
    else:
        pass

#array = dataset.values
X = dataset.values[:, 0:20] #primeiras sete caracteristicas
y = dataset.values[:,20] #atributo classe

print(X)

clf = tree.DecisionTreeClassifier(criterion='entropy')
clf.fit(X,y)

dotfile = open("banco.dot","w")
tree.export_graphviz(clf, out_file=dotfile, feature_names=dataset.columns)
dotfile.close()
 
print("acabou")







clf = neighbors.KNeighborsClassifier(n_neighbors)
 
scores = cross_val_score(clf, X, Y, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
