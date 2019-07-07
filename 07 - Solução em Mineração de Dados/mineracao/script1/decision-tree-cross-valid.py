import pandas
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn import tree

def get_code(tree, feature_names):
        left      = tree.tree_.children_left
        right     = tree.tree_.children_right
        threshold = tree.tree_.threshold
        features  = [feature_names[i] for i in tree.tree_.feature]
        value = tree.tree_.value

        def recurse(left, right, threshold, features, node):
                if (threshold[node] != -2):
                        print ("if ( " + features[node] + " <= " + str(threshold[node]) + " ) {")
                        if left[node] != -1:
                                recurse (left, right, threshold, features,left[node])
                        print ("} else {")
                        if right[node] != -1:
                                recurse (left, right, threshold, features,right[node])
                        print ("}")
                else:
                        print ("return ", str(value[node]))

        recurse(left, right, threshold, features, 0)

   
names = ['num-pregnant', 'glucose', 'diastolic', 'triceps-skin', 'insulin', 'body-mass', 'diabetes-pedigree', 'age']

#[n-exemplos, classe]

dataset = pandas.read_csv("pima-indians-diabetes.csv")

print(dataset.head())

X = dataset.values[:, 0:7]# :todas as linhas da coluna de 0 á 7
Y = dataset.values[:,8] #label do rotulo

#usando o metodo para fazer uma unica divisao dos dados de teste=25% e treinamento=75%
X_train, X_test, y_train, y_test = train_test_split( 
        X, Y, test_size = 0.25, random_state = 10)

# criando arvore de decisao do tipo entropy
# criterion='entropy'->
# max_depth=4 -> A profundidade máxima da árvore
clf = tree.DecisionTreeClassifier(criterion='entropy', max_depth=4, random_state=10)
clf2 = tree.DecisionTreeClassifier()
#clf = clf.fit(X_train, y_train)

#print("Acuracia train: %0.3f" %  clf.score(X_train, y_train))
#print("Acuracia test: %0.3f" %  clf.score(X_test, y_test))

# teste de validação cruzada que cria 10 vezes amostragem dos dados
scores = cross_val_score(clf, X, Y, cv=10)
print("-------------------")
print("Conteudo da variavel scores", scores)
print("-------------------")

# validação de amostragem, quanto deu o seu valor medio
print("Accuracy clf: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))


scores2 = cross_val_score(clf2, X, Y, cv=10)
print("Accuracy clf2: %0.2f (+/- %0.2f)" % (scores2.mean(), scores2.std() * 2))
print("-------------------")
print("Conteudo da variavel scores", scores2)

modelo = clf.fit(X,Y)

print(modelo)

# #clf = clf.fit(iris.data, iris.target)
# #dotfile = open("dt-iris.dot", 'w')
# #tree.export_graphviz(clf, out_file=dotfile, feature_names=iris.feature_names)
# #dotfile.close()

# #usando o metodo para fazer uma unica divisao dos dados
# X_train, X_test, y_train, y_test = train_test_split( X, Y, test_size = 0.3, random_state = 10)
# clf = clf.fit(X_train, y_train)

# print("Arvore de decisao gerada:")
# get_code(clf,names)