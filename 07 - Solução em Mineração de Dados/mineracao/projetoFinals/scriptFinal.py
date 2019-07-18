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
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import BaggingClassifier
from sklearn.neural_network import MLPClassifier
from scipy import stats


import warnings
warnings.filterwarnings("ignore")

#--------------------------------------------------------#
# Leitura de arquivo
#--------------------------------------------------------#

# carregando dados do arquivo
dataset = arff.loadarff('TrainingDataset.arff')
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
#
#print("\nApresentando o shape dos dados (dimenssoes)->" ,input_data_df.shape ) 
# 
#print("\nVisualizando os 20 primeiros dados")
#print( input_data_df.head(20) )
#  
#print("\nDados estatisticos (describe)-> " ) 
#print( input_data_df.describe() ) 
#
#print("\nDistribuicao dos dados por classes (class distribution)-> ") 
#print( input_data_df.groupby('Result').size() )
#   
#--------------------------------------------------------#
# separação de X e y
#--------------------------------------------------------#
 
X = input_data_df.values[:,0:29] #separa os dados da primeira coluna (0) ate a penultima (8)
Y = input_data_df.values[:,30] #separa os dados da ultima coluna

#--------------------------------------------------------#
# separação de treinamento de teste
#--------------------------------------------------------#

seed = 10
#usando o metodo para fazer uma unica divisao dos dados de teste=25% e treinamento=75%
X_train, X_test, Y_train, y_test = train_test_split( X, Y, test_size = 0.25, random_state = seed)
 
#--------------------------------------------------------#
#  Arvore de decisão - DecisionTreeClassifier
#--------------------------------------------------------#
#numProfundidade = 0
#
#for i in range(10):
#    numProfundidade = numProfundidade + 5
#    arvoreDecisao = tree.DecisionTreeClassifier(criterion='entropy', max_depth = numProfundidade, random_state=seed)
#    score = cross_val_score(arvoreDecisao, X_train, Y_train, cv=10)
#    media = score.mean()
#    desvioPadrao = score.std()
#    print("Accuracy in Arvore de decisao: %0.2f (+/- %0.2f)" % (media, desvioPadrao * 2), "Profundidade: ", numProfundidade, "Interacao: ", i ) 
        
#--------------------------------------------------------#
# criando arquivo de decisão 
#--------------------------------------------------------#
# Constroi um classificador com arvore de decisao
#dt = tree.DecisionTreeClassifier(criterion='entropy')
#dt.fit(X, Y)
#
#dotfile = open("dt-phishing.dot", 'w')
#tree.export_graphviz(dt, out_file=dotfile)
#dotfile.close()
#print("Arvore de decisao gerada no diretorio!")
    
#--------------------------------------------------------#
# Arvore de decisão - Random Forest
#--------------------------------------------------------#
#numEstimador = 0
#
#for i in range(10):
#    numEstimador = numEstimador + 2 
#    florestaAleatoria = RandomForestClassifier(n_estimators=numEstimador, max_features=3, random_state=seed)
#    score = cross_val_score(florestaAleatoria, X_train, Y_train, cv=10)
#    media = score.mean()
#    desvioPadrao = score.std()      
#    print("Accuracy Random Forest: %0.2f (+/- %0.2f)" % (score.mean(), score.std() * 2), "Estimador: ", numEstimador, "Interacao: ", i )

#--------------------------------------------------------#
# Rede Neural MLP
#--------------------------------------------------------# 
qtdNeuronio = 0

# variando rede neural com quantidade de neuronio +1 na iteração
for i in range(5):
    qtdNeuronio = qtdNeuronio + 1
    # treinando
    mlp = MLPClassifier(hidden_layer_sizes=(qtdNeuronio) )
    mlp.fit(X_train, Y_train)
    # teste
    predictions = mlp.predict(X_test)    
    print("\nMatriz de confusao")
    print(confusion_matrix(y_test, predictions) )
    print("\nMedidas de precisao")
    print(classification_report(y_test, predictions) )  
    
    mlp = MLPClassifier(hidden_layer_sizes=(10))
    redeNeural = cross_val_score(mlp, X, Y, cv=10)
    print("Accuracy mlp: %0.2f (+/- %0.2f)" % (redeNeural.mean(), redeNeural.std() * 2),"Neuronios: ", qtdNeuronio, "Interacao: ", i)
    

qtdNeuronio = 0
    
# variando rede neural com quantidade de neuronio +2 na iteração e camadas -1
for i in range(5):
    qtdNeuronio = qtdNeuronio + 2
    # treinando
    mlp = MLPClassifier(hidden_layer_sizes=(qtdNeuronio, qtdNeuronio-1))
    mlp.fit(X_train, Y_train)
    # testando
    predictions = mlp.predict(X_test)
    print("\nMatriz de confusao")
    print(confusion_matrix(y_test,predictions))
    print("\nMedidas de precisao")
    print(classification_report(y_test,predictions))
    
    mlp = MLPClassifier(hidden_layer_sizes=(10) )
    redeNeural = cross_val_score(mlp, X, Y, cv=10)
    print("Accuracy mlp: %0.2f (+/- %0.2f)" % (redeNeural.mean(), redeNeural.std() * 2), "Neuronios: ", qtdNeuronio, "Interacao: ", i)

#--------------------------------------------------------#
# graficos de apresentação da distribuição por classe
#--------------------------------------------------------#

#Criando graficos da distribuicao das classes
#print("grafico do tipo box")
#input_data_df.plot(kind='box', subplots=True, layout=(31,31), sharex=False, sharey=False,title="Distribuicao das classes")
#plt.show()

#--------------------------------------------------------#
# o melhor classificador de cada tipo
# parametros de cada classificador vindos apartir dos testes acima
#--------------------------------------------------------#

RFC = RandomForestClassifier(n_estimators=8,random_state=seed)
DTC = tree.DecisionTreeClassifier(criterion='entropy',max_depth = 20, random_state=seed)
MLP = MLPClassifier(solver='lbfgs', alpha=1e-5, hidden_layer_sizes=([2,3]), random_state=seed)
BMLP = BaggingClassifier(base_estimator=MLP, n_estimators=10, random_state=seed)

#criando modelo dos melhores classificadores
models = []
models.append(('Arvore', DTC))
models.append(('ComiteArvore', RFC))
models.append(('RedeNeural', MLP))
models.append(('ComiteRede', BMLP))
# evaluate each model in turn
results = []
names = []
scoring = 'accuracy'

#--------------------------------------------------------#
# k-fold
#--------------------------------------------------------#

kfold = model_selection.StratifiedKFold(n_splits=10, random_state=seed)

for name, model in models:
	cv_results = model_selection.cross_val_score(model, X_train, Y_train, cv=kfold, scoring=scoring)
	results.append(cv_results)
	names.append(name)
	msg = "%s: %f (%f)" % (name, cv_results.mean(), cv_results.std())
	print(msg)

#--------------------------------------------------------#
# Teste de hipotese analisando o p-value
#--------------------------------------------------------#
print('Comparacao Arvore | ComiteArvore     ->', stats.kruskal(results[0],results[1]) )
print('Comparacao Arvore | RedeNeural       ->',stats.kruskal(results[0],results[2]) )
print('Comparacao Arvore | CRNA             ->',stats.kruskal(results[0],results[3]) )
print('Comparacao ComiteArvore | RedeNeural ->',stats.kruskal(results[1],results[2]) )
print('Comparacao ComiteArvore | ComiteRede ->',stats.kruskal(results[1],results[3]) )
print('Comparacao RedeNeural | ComiteRede   ->',stats.kruskal(results[2],results[3]) )	

#--------------------------------------------------------#
# grafico de comparacao entre clafificadores
#--------------------------------------------------------#

#fig = plt.figure()
#fig.suptitle('Algorithm Comparison')
#ax = fig.add_subplot(111)
#plt.boxplot(results)
#ax.set_xticklabels(names)
#plt.show()	

#--------------------------------------------------------#
# acuracia entre treinamento e teste
#--------------------------------------------------------#

#RFC.fit(X_train, Y_train);
#DTC.fit(X_train, Y_train);
#MLP.fit(X_train, Y_train);
#BMLP.fit(X_train, Y_train);
#
#print('Acuracias')
#print('Arvore: Treinamento ->',  RFC.score(X_train, Y_train),' | Teste' ,RFC.score(X_test, y_test))
#print('Comite Arvore: Treinamento ->',  DTC.score(X_train, Y_train),' | Teste' ,DTC.score(X_test, y_test))
#print('Rede Neural: Treinamento ->',  MLP.score(X_train, Y_train),' | Teste' ,MLP.score(X_test, y_test))
#print('Comite RNA: Treinamento ->',  BMLP.score(X_train, Y_train),' | Teste' ,BMLP.score(X_test, y_test))
#
