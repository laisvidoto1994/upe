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

seed = 10
#usando o metodo para fazer uma unica divisao dos dados de teste=25% e treinamento=75%
X_train, X_test, Y_train, y_test = train_test_split( X, Y, test_size = 0.25, random_state = seed)
 
#--------------------------------------------------------#
#  Arvore de decisão simples - DecisionTreeClassifier
#--------------------------------------------------------#
numProfundidade = 0

for i in range(10):
    numProfundidade = numProfundidade + 5
    arvoreDecisao = tree.DecisionTreeClassifier(criterion='entropy', max_depth = numProfundidade, random_state=seed)
    score = cross_val_score(arvoreDecisao, X_train, Y_train, cv=10)
    media = score.mean()
    desvioPadrao = score.std()
    print("Accuracy in Arvore de decisao: %0.2f (+/- %0.2f)" % (media, desvioPadrao * 2), "Profundidade: ", numProfundidade, "Interacao: ", i ) 
        
#--------------------------------------------------------#
# Arvore de decisão - Random Forest
#--------------------------------------------------------#
numEstimador = 0

for i in range(10):
    numEstimador = numEstimador + 2 
    florestaAleatoria = RandomForestClassifier(n_estimators=numEstimador, max_features=3, random_state=seed)
    score = cross_val_score(florestaAleatoria, X_train, Y_train, cv=10)
    media = score.mean()
    desvioPadrao = score.std()      
    print("Accuracy Random Forest: %0.2f (+/- %0.2f)" % (score.mean(), score.std() * 2), "Estimador: ", numEstimador, "Interacao: ", i )

#--------------------------------------------------------#
# Rede Neural MLP
#--------------------------------------------------------# 


#--------------------------------------------------------#
# Comitê de Redes Neurais
#--------------------------------------------------------#


#--------------------------------------------------------#
# criando arquivo de decisão 
#--------------------------------------------------------#
  
    
    
#--------------------------------------------------------#
# Validação Cruzada - cross_val_score
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
 



