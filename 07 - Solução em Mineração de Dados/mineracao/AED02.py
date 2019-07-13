# Compare Algorithms
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats
from sklearn import model_selection
from sklearn import tree
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import BaggingClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from scipy.io import arff
# load dataset

import warnings
warnings.filterwarnings("ignore")


dataset = arff.loadarff('TrainingDataset.arff')
input_data_df = pd.DataFrame(dataset[0])
#print(input_data_df.head())

for col in input_data_df:
        temp = list(map(lambda x: int(x.decode('UTF-8')),input_data_df[col]))
        input_data_df[col] = temp

X = input_data_df.values[:,0:29]
Y = input_data_df.values[:,30]

# prepare configuration for cross validation test harness
seed = 7
# prepare models
RFC = RandomForestClassifier(n_estimators=6,random_state=seed)
DTC = tree.DecisionTreeClassifier(criterion='entropy',max_depth = 15, random_state=seed)
MLP = MLPClassifier(solver='lbfgs', alpha=1e-5, hidden_layer_sizes=([2,3]), random_state=seed)
BMLP = BaggingClassifier(base_estimator=MLP, n_estimators=10, random_state=seed)

models = []
models.append(('Arvore', DTC))
models.append(('ComiteArvore', RFC))
models.append(('RedeNeural', MLP))
models.append(('ComiteRede', BMLP))
# evaluate each model in turn
results = []
names = []
scoring = 'accuracy'

kfold = model_selection.StratifiedKFold(n_splits=10, random_state=seed)

X_train, X_test, y_train, y_test = train_test_split(X, Y, random_state=seed)

for name, model in models:
	cv_results = model_selection.cross_val_score(model, X_train, y_train, cv=kfold, scoring=scoring)
	results.append(cv_results)
	names.append(name)
	msg = "%s: %f (%f)" % (name, cv_results.mean(), cv_results.std())
	print(msg)

# Teste de hipotese analisando o p-value
print('Comparacao Arvore | ComiteArvore ->', stats.kruskal(results[0],results[1]))
print('Comparacao Arvore | RedeNeural ->',stats.kruskal(results[0],results[2]))
print('Comparacao Arvore | CRNA ->',stats.kruskal(results[0],results[3]))
print('Comparacao ComiteArvore | RedeNeural ->',stats.kruskal(results[1],results[2]))
print('Comparacao ComiteArvore | ComiteRede ->',stats.kruskal(results[1],results[3]))
print('Comparacao RedeNeural | ComiteRede ->',stats.kruskal(results[2],results[3]))	

RFC.fit(X_train, y_train);
DTC.fit(X_train, y_train);
MLP.fit(X_train, y_train);
BMLP.fit(X_train, y_train);

print("Acuracias Arvore: Treinamento",  RFC.score(X_train, y_train)," Teste" ,RFC.score(X_test, y_test))
print("Acuracias Comite Arvore: Treinamento",  DTC.score(X_train, y_train)," Teste" ,DTC.score(X_test, y_test))
print("Acuracias Rede Neural: Treinamento",  MLP.score(X_train, y_train)," Teste" ,MLP.score(X_test, y_test))
print("Acuracias Comite RNA: Treinamento",  BMLP.score(X_train, y_train)," Teste" ,BMLP.score(X_test, y_test))

fig = plt.figure()
fig.suptitle('Algorithm Comparison')
ax = fig.add_subplot(111)
plt.boxplot(results)
ax.set_xticklabels(names)
plt.show()	
