import pandas
from sklearn import neighbors
from sklearn.model_selection import cross_val_score
   
names = ['num-pregnant', 'glucose', 'diastolic', 'triceps-skin', 'insulin', 'body-mass', 'diabetes-pedigree', 'age']

dataset = pandas.read_csv("pima-indians-diabetes.csv")

dataset.head()

n_neighbors = 15# quantidade de vizinhos

X = dataset.values[:, 0:7] #primeiras sete caracteristicas
Y = dataset.values[:,8] #atributo classe

# we create an instance of Neighbours Classifier and fit the data.
clf = neighbors.KNeighborsClassifier(n_neighbors)
#clf.fit(X,Y)

#print("Acuracia: %0.3f" %  clf.score(X, Y))

scores = cross_val_score(clf, X, Y, cv=10)
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
