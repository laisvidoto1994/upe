# -*- coding: utf-8 -*-
"""
Created on Fri Aug  9 20:17:08 2019

@author: pos
"""

# fazendo leitura do arquivo treinamento-> "train_catvnoncat.h5" e teste-> "test_catvnoncat.h5"
import numpy as np
import h5py

def load_dataset():
    #leitura do arquivo de treinamento
    train_dataset = h5py.File('train_catvnoncat.h5', "r")
    train_set_x_orig = np.array(train_dataset["train_set_x"][:]) # your train set features
    train_set_y_orig = np.array(train_dataset["train_set_y"][:]) # your train set labels
    
    for key in train_dataset.keys():
        print(key)
        
     #leitura do arquivo de teste
    test_dataset = h5py.File('test_catvnoncat.h5', "r")
    test_set_x_orig = np.array(test_dataset["test_set_x"][:]) # your test set features
    test_set_y_orig = np.array(test_dataset["test_set_y"][:]) # your test set labels
    
    classes = np.array(test_dataset["list_classes"][:]) # the list of classes
    train_set_y_orig = train_set_y_orig.reshape((1, train_set_y_orig.shape[0]))
    test_set_y_orig = test_set_y_orig.reshape((1, test_set_y_orig.shape[0]))
    return train_set_x_orig, train_set_y_orig, test_set_x_orig, test_set_y_orig, classes

    
#Ajustando os dados
def load_processed_cat_dataset(train_set_x_orig, test_set_x_orig):
    train_set_x_flatten = train_set_x_orig.reshape(train_set_x_orig.shape[0], -1).T
    test_set_x_flatten = test_set_x_orig.reshape(test_set_x_orig.shape[0], -1).T
    #convertendo em 0 e 1
    train_set_x = train_set_x_flatten/255.
    test_set_x = test_set_x_flatten/255.
    return train_set_x, test_set_x


def sigmoid(z):
    s = 1 / (1 + np.exp(-z))
    return s


def forward(w, b, X, Y):
    m = X.shape[1]
    # FORWARD PROPAGATION (FROM X TO COST)
    # compute activation
    A = sigmoid(np.dot(w.T,X) + b)
    # compute cost
    cost = (-1/m) * np.sum( (Y *np.log(A)) + ((1-Y) * np.log(1-A)) )
    return A, cost


def backward(A, X, Y):
    m = X.shape[1]
    db = (1/m) * (np.sum(A-Y))
    dw = (1/m)*(np.dot(X,np.subtract(A,Y).T))
    grads = {"dw": dw,
    "db": db}
    return grads


def optimize(w, b, X, Y, num_iterations, learning_rate):
    costs = []
    for i in range(num_iterations):
    A, cost = forward(w, b, X, Y)
    grads = backward(A, X, Y)
    dw = grads["dw"]
    db = grads["db"]
    w = w - learning_rate * dw
    b = b - learning_rate * db
    if i % 100 == 0:
    costs.append(cost)
    params = {"w": w, "b": b}
    grads = {"dw": dw, "db": db}
    return params, grads, costs


def predict(w, b, X):
    m = X.shape[1]
    Y_prediction = np.zeros((1,m))
    w = w.reshape(X.shape[0], 1)
    A = sigmoid(np.dot(w.T,X) + b)
    for i in range(A.shape[1]):
    if (A[0,i] <=0.5):
    Y_prediction[0,i] = 0
    elif (A[0,i] > 0.5):
    Y_prediction[0,i] = 1
    pass
    return Y_prediction


def model(X_train, Y_train, X_test, Y_test, num_iterations = 2000, learning_rate = 0.5):
    w = np.zeros((X_train.shape[0], 1))
    b = 0
    parameters, grads, costs = optimize(w, b, X_train, Y_train, num_iterations, learning_rate)
    w = parameters["w"]
    b = parameters["b"]
    Y_prediction_test = predict(w, b, X_test)
    Y_prediction_train = predict(w, b, X_train)
    print("train accuracy: {} %".format(100 - np.mean(np.abs(Y_prediction_train - Y_train)) * 100))
    print("test accuracy: {} %".format(100 - np.mean(np.abs(Y_prediction_test - Y_test)) * 100))
    
    costs = np.squeeze(costs)
    plt.plot(costs)
    plt.ylabel('cost')
    plt.xlabel('iterations (per hundreds)')
    plt.title("Learning rate =" + str(learning_rate))
    plt.show()

##### Executando #####
    
#chamando a funcao load_dataset()
train_set_x_orig, train_set_y, test_set_x_orig, test_set_y, classes = load_dataset()

#chamando a funcao load_processed_cat_dataset()
train_set_x, test_set_x = load_processed_cat_dataset(train_set_x_orig, test_set_x_orig)

#chamando a funcao model()
model(train_set_x, train_set_y, test_set_x, test_set_y, num_iterations = 2000, learning_rate = 0.005)










