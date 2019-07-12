from sklearn import datasets
#from sklearn.datasets import load_breast_cancer
#cancer = datasets.load_iris()
#cancer = load_breast_cancer()
from sklearn.datasets import load_digits
from sklearn.model_selection import cross_val_score

cancer = load_digits()

print( "\nAtibutos " )
print(cancer.keys())

# Print full description by running:
# print(cancer['DESCR'])
# 569 data points with 30 features
print("\n(dados X atributos)")
print(cancer['data'].shape)

X = cancer['data']
y = cancer['target']

from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y)

from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
# Fit only to the training data
scaler.fit(X_train)

# Now apply the transformations to the data:
X_train = scaler.transform(X_train)
X_test = scaler.transform(X_test)

#criando rede neural
from sklearn.neural_network import MLPClassifier
mlp = MLPClassifier(hidden_layer_sizes=([3,3]))

mlp.fit(X_train,y_train)
#usando á rede treinada da rede neural para o uso do cliente
predictions = mlp.predict(X_test)

from sklearn.metrics import classification_report,confusion_matrix
print("\nMatriz de confusao")
print(confusion_matrix(y_test,predictions))

print("\nMedidas de precisao")
print(classification_report(y_test,predictions))

mlp = MLPClassifier(hidden_layer_sizes=(10))
scores = cross_val_score(mlp, X, y, cv=10)
print("\nAccuracy clf: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))
