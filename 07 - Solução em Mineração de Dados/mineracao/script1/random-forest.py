
# Random Forest Classification
import pandas
from sklearn import tree
from sklearn import model_selection
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.ensemble import RandomForestClassifier

names = ['preg', 'plas', 'pres', 'skin', 'test', 'mass', 'pedi', 'age', 'class']
dataframe = pandas.read_csv("pima-indians-diabetes.csv", names=names)
array = dataframe.values

X = array[:,0:8]# pega todos os dados
Y = array[:,8]# pega apenas os valores de class

print(Y)

seed = 7
num_trees = 100 #numero de arvores
max_features = 3 #quantidade de caracteristicas que eu vou considerar

percentualParaTreinar = 0.30 # percentual de dados que ele vai terinar

kfold = model_selection.StratifiedKFold(n_splits=10, random_state=seed)
model = RandomForestClassifier(n_estimators=num_trees, max_features=max_features)
results = model_selection.cross_val_score(model, X, Y, cv=kfold)
print(results.mean())

X_train, X_test, y_train, y_test = train_test_split( X, Y, test_size=percentualParaTreinar, random_state=seed)
clf = tree.DecisionTreeClassifier(criterion='entropy',random_state=seed)
clf = clf.fit(X_train, y_train)
print("Acuracia: %0.3f" %  clf.score(X_test, y_test))