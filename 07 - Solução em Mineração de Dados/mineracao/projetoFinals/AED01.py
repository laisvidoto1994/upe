#Universidade de Pernambuco (UPE)
#Escola Politecnica de Pernambuco (Poli)
#Curso de Especializacao em Ciencia dos Dados e Analytics
#Disciplina de Solucoes em Mineracao de dados
#--------------------------------------------------------
#Script para a analise exploratoria dos dados (AED)
#--------------------------------------------------------


# Importando as bibliotecas necessarias
from IPython.display import display
import pandas as pd
from pandas.plotting import scatter_matrix
import matplotlib.pyplot as plt
from scipy.io import arff
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn import tree
from sklearn import model_selection
from sklearn.metrics import classification_report
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import confusion_matrix


import warnings
warnings.filterwarnings("ignore")

# Fazendo o carregamento dos dados diretamente do UCI Machine Learning
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00327/Training%20Dataset.arff"

# Definindo o nome de cada coluna dos dados
dataset = arff.loadarff('TrainingDataset.arff')
input_data_df = pd.DataFrame(dataset[0])


for col in input_data_df:
        temp = list(map(lambda x: int(x.decode('UTF-8')),input_data_df[col]))
        input_data_df[col] = temp

print("Apresentando o shape dos dados (dimensoes)")
print(input_data_df.shape)

print("Visualizando o conjunto inicial (head) dos dados, ou mais claramente, os 20 primeiros registros (head(20))")
print(input_data_df.head(20))

print("Conhecendo os dados estatisticos dos dados carregados (describe)")
print(input_data_df.describe())

print("Conhecendo a distribuicao dos dados por classes (class distribution)")
print(input_data_df.groupby('Result').size())

print("Criando graficos de caixa da distribuicao das classes")
#input_data_df.plot(kind='box', subplots=True, layout=(31,31), sharex=False, sharey=False)
#plt.show()

print("Criando histogramas dos dados por classes")
input_data_df.hist()
#plt.show()

print("Criando histogramas de correlacao")
input_data_df.corr()
#plt.show()

print("Criando graficos de dispersao dos dados")
#scatter_matrix(input_data_df)
#plt.show()

print(input_data_df)
print(input_data_df.shape)
print(input_data_df.dtypes)
print(input_data_df.head())

#separa os dados da primeira coluna (0) ate a penultima (29)
X = input_data_df.values[:,0:29]
 #separa os dados da ultima coluna
Y = input_data_df.values[:,30]

#usando o metodo para fazer uma unica divisao dos dados
X_train, X_test, y_train, y_test = train_test_split( X, Y, test_size = 0.25, random_state = 10)

print('#########################################################')
print('#########################################################')
print('#########################################################')

#clf = tree.DecisionTreeClassifier(criterion='entropy',random_state=10)
clf1 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 5, random_state=10)
clf2 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 6, random_state=10)
clf3 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 7, random_state=10)
clf4 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 8, random_state=10)
clf5 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 9, random_state=10)
clf6 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 15, random_state=10)#
clf7 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 19, random_state=10)
clf8 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 21, random_state=10)
clf9 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 25, random_state=10)
clf10 = tree.DecisionTreeClassifier(criterion='entropy', max_depth = 40, random_state=10)

scores1 = cross_val_score(clf1, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores1.mean(), scores1.std() * 2))
scores2 = cross_val_score(clf2, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores2.mean(), scores2.std() * 2))
scores3 = cross_val_score(clf3, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores3.mean(), scores3.std() * 2))
scores4 = cross_val_score(clf4, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores4.mean(), scores4.std() * 2))
scores5 = cross_val_score(clf5, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores5.mean(), scores5.std() * 2))
scores6 = cross_val_score(clf6, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores6.mean(), scores6.std() * 2))
scores7 = cross_val_score(clf7, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores7.mean(), scores7.std() * 2))
scores8 = cross_val_score(clf8, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores8.mean(), scores8.std() * 2))
scores9 = cross_val_score(clf9, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores9.mean(), scores9.std() * 2))
scores10 = cross_val_score(clf10, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores10.mean(), scores10.std() * 2))

#RESULTADO 0.96 DE ACC
print('#########################################################')
print('#########################################################')
print('#########################################################')
seed = 7
max_features = 3

clf1 = RandomForestClassifier(n_estimators=1, max_features=max_features)
clf2 = RandomForestClassifier(n_estimators=2, max_features=max_features)
clf3 = RandomForestClassifier(n_estimators=3, max_features=max_features)
clf4 = RandomForestClassifier(n_estimators=4, max_features=max_features)
clf5 = RandomForestClassifier(n_estimators=5, max_features=max_features)
clf6 = RandomForestClassifier(n_estimators=6, max_features=max_features)
clf7 = RandomForestClassifier(n_estimators=7, max_features=max_features)
clf8 = RandomForestClassifier(n_estimators=8, max_features=max_features)
clf9 = RandomForestClassifier(n_estimators=9, max_features=max_features)#
clf10 = RandomForestClassifier(n_estimators=10, max_features=max_features)

scores1 = cross_val_score(clf1, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores1.mean(), scores1.std() * 2))
scores2 = cross_val_score(clf2, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores2.mean(), scores2.std() * 2))
scores3 = cross_val_score(clf3, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores3.mean(), scores3.std() * 2))
scores4 = cross_val_score(clf4, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores4.mean(), scores4.std() * 2))
scores5 = cross_val_score(clf5, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores5.mean(), scores5.std() * 2))
scores6 = cross_val_score(clf6, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores6.mean(), scores6.std() * 2))
scores7 = cross_val_score(clf7, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores7.mean(), scores7.std() * 2))
scores8 = cross_val_score(clf8, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores8.mean(), scores8.std() * 2))
scores9 = cross_val_score(clf9, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores9.mean(), scores9.std() * 2))
scores10 = cross_val_score(clf10, X_train, y_train, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores10.mean(), scores10.std() * 2))

print('#########################################################')
print('#########################################################')
print('#########################################################')

#################################################################primeiro teste

mlp = MLPClassifier(hidden_layer_sizes=([1,2]) )
mlp.fit(X_train,y_train)
predictions = mlp.predict(X_test)

mlp = MLPClassifier(hidden_layer_sizes=(10))
scores = cross_val_score(mlp, X_train, y_train, cv=10)
print("Accuracy clf 0: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
#################################################################segundo teste
mlp1 = MLPClassifier(hidden_layer_sizes=([1,2]))############Esse e o melhor
mlp1.fit(X_train,y_train)
predictions = mlp1.predict(X_test)

mlp1 = MLPClassifier(hidden_layer_sizes=(10))
scores = cross_val_score(mlp1, X_train, y_train, cv=10)
print("Accuracy clf 1: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
#################################################################terceiro teste
mlp2 = MLPClassifier(hidden_layer_sizes=([1,3]))
mlp2.fit(X_train,y_train)
predictions = mlp2.predict(X_test)

mlp2 = MLPClassifier(hidden_layer_sizes=(10))
scores = cross_val_score(mlp2, X_train, y_train, cv=10)
print("Accuracy clf 2: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
#################################################################qurato teste
mlp3 = MLPClassifier(hidden_layer_sizes=([2,1]))
mlp3.fit(X_train,y_train)
predictions = mlp3.predict(X_test)

mlp3 = MLPClassifier(hidden_layer_sizes=(10))
scores = cross_val_score(mlp3, X_train, y_train, cv=10)
print("Accuracy clf 3: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
#################################################################quinto teste
mlp4 = MLPClassifier(hidden_layer_sizes=([2,2]))
mlp4.fit(X_train,y_train)
predictions = mlp4.predict(X_test)

mlp3 = MLPClassifier(hidden_layer_sizes=(10))
scores = cross_val_score(mlp4, X_train, y_train, cv=10)
print("Accuracy clf 4: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
#################################################################sexto teste
mlp5 = MLPClassifier(hidden_layer_sizes=([2,3]))
mlp5.fit(X_train,y_train)
predictions = mlp5.predict(X_test)

mlp5 = MLPClassifier(hidden_layer_sizes=(10))
scores = cross_val_score(mlp5, X_train, y_train, cv=10)
print("Accuracy clf 5: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))

print('#########################################################')
print('#########################################################')
print('#########################################################')
      
# Constroi um classificador com arvore de decisao
dt = tree.DecisionTreeClassifier(criterion='entropy')
dt.fit(X, Y)

dotfile = open("dt-phishing.dot", 'w')
tree.export_graphviz(dt, out_file=dotfile)
dotfile.close()
print("Arvore de decisao gerada no diretorio!")

print('#########################################################')
print('#########################################################')
print('#########################################################')
      
seed = 7
num_trees = 100
max_features = 3
kfold = model_selection.StratifiedKFold(n_splits=10, random_state=seed)
model = RandomForestClassifier(n_estimators=num_trees, max_features=max_features)
results = model_selection.cross_val_score(model, X, Y, cv=kfold)
print(results.mean())

X_train, X_test, y_train, y_test = train_test_split( X, Y, test_size=0.30, random_state=seed)
clf = tree.DecisionTreeClassifier(criterion='entropy', max_depth=5, random_state=seed)
clf = clf.fit(X_train, y_train)
print("Acuracia: %0.3f" %  clf.score(X_test, y_test))