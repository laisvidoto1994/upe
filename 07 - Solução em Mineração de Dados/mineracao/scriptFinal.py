# Universidade de Pernambuco (UPE)
# Escola Politecnica de Pernambuco (Poli)
# Curso de Especializacao em Ciencia dos Dados e Analytics
# Disciplina de Solucoes em Mineracao de dados

#--------------------------------------------------------#
# Script para a analise exploratoria dos dados (AED)
#--------------------------------------------------------#

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

#--------------------------------------------------------#
# Leitura de arquivo
#--------------------------------------------------------#

# carregando dados do arquivo
dataset = arff.loadarff('Training Dataset.arff')
input_data_df = pd.DataFrame(dataset[0]) 

#--------------------------------------------------------#
# formatação do tipo de dados para int
#--------------------------------------------------------# 
for col in input_data_df: 
        temp = list(map(lambda x: int(x.decode('UTF-8')),input_data_df[col]))
        input_data_df[col] = temp 
          
#--------------------------------------------------------#
# apresentação dos dados
#--------------------------------------------------------#

print("\nApresentando o shape dos dados (dimenssoes)->" ,input_data_df.shape ) 
 
print("\nVisualizando os 20 primeiros dados")
print( input_data_df.head(20) )
  
print("\nDados estatisticos (describe)-> " ) 
print( input_data_df.describe() ) 

print("\nDistribuicao dos dados por classes (class distribution)-> ") 
print( input_data_df.groupby('Result').size() )
   
#--------------------------------------------------------#
# separação de X e y
#--------------------------------------------------------#
 
X = input_data_df.values[:,0:29] #separa os dados da primeira coluna (0) ate a penultima (8)
Y = input_data_df.values[:,30] #separa os dados da ultima coluna

#--------------------------------------------------------#
# separação de treinamento de teste
#--------------------------------------------------------#

#usando o metodo para fazer uma unica divisao dos dados de teste=25% e treinamento=75%
X_train, X_test, y_train, y_test = train_test_split( X, Y, test_size = 0.25, random_state = 10)
 
#--------------------------------------------------------#
#  Arvore de decisão simples
#--------------------------------------------------------#
     
# Constroi um classificador com arvore de decisao
#clf = tree.DecisionTreeClassifier(criterion='entropy',random_state=10)
clf = tree.DecisionTreeClassifier(criterion='entropy',max_depth = 5, random_state=10)
clf2 = tree.DecisionTreeClassifier()
#clf = clf.fit(X_train, y_train)
 
print("Acuracia train: %0.3f" % clf.score(X_train, y_train) )
print("Acuracia test: %0.3f" % clf.score(X_test, y_test) )
 
#--------------------------------------------------------#
# criando arquivo de decisão 
#--------------------------------------------------------#
 
dotfile = open("dt-phishing.dot", 'w')
tree.export_graphviz(clf, out_file=dotfile)
dotfile.close()
print("Arvore de decisao gerada no diretorio!")

#--------------------------------------------------------#
# Validação Cruzada - cross_val_score
#--------------------------------------------------------#

# teste de validação cruzada que cria 10 vezes amostragem dos dados
scores = cross_val_score(clf, X, Y, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))

print("Conteudo da variavel scores", scores)
    
#--------------------------------------------------------#
# Random Forest
#--------------------------------------------------------#
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

#--------------------------------------------------------#
# Rede Neural MLP
#--------------------------------------------------------# 


#--------------------------------------------------------#
# Comitê de Redes Neurais
#--------------------------------------------------------#


#--------------------------------------------------------#
# graficos de apresentação da distribuição por classe
#--------------------------------------------------------#

#Criando graficos da distribuicao das classes
#print("grafico do tipo box")
#input_data_df.plot(kind='box', subplots=True, layout=(31,31), sharex=False, sharey=False,title="Distribuicao das classes")
#plt.show()

#--------------------------------------------------------#
# 
#--------------------------------------------------------#
 

#--------------------------------------------------------#
# 
#--------------------------------------------------------#

#--------------------------------------------------------#
# 
#--------------------------------------------------------#
 

#--------------------------------------------------------#
# 
#--------------------------------------------------------#








