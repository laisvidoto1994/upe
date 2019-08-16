'''
Created on 16 de out de 2018

@author: bruno
'''
import numpy as np
import matplotlib.pyplot as plt
import h5py
import scipy
from PIL import Image
from scipy import ndimage
from lr_utils import load_dataset


def load_processed_cat_dataset(train_set_x_orig, train_set_y, test_set_x_orig, test_set_y, classes):
    index = 25 # referencia da imagem que eu queira
    conversao = 255 # conversao dos dados entre 0 e 1
    plt.imshow(train_set_x_orig[index])
    plt.show()
    print (
            "y = " + str(train_set_y[:, index]) + ",a imagem e um: " 
           + classes[np.squeeze(train_set_y[:, index])].decode("utf-8")
           )
    
    m_train = train_set_x_orig.shape[0]
    m_test = test_set_x_orig.shape[0]
    num_px = train_set_x_orig.shape[1]    
    
    train_set_x_flatten = train_set_x_orig.reshape(train_set_x_orig.shape[0], -1).T
    test_set_x_flatten = test_set_x_orig.reshape(test_set_x_orig.shape[0], -1).T
        
    print ("\n Height/Width da imagem em pixel: " + str(num_px))
    print ("tamanho da imagem em pixels: (" + str(num_px) + ", " + str(num_px) + ", 3)")
        
    print ("\n Number of treinando: m_train = " + str(m_train))
    print ("Number of testing: m_test = " + str(m_test))
    
    print ("\n train_set_x_orig : " + str(train_set_x_orig.shape))
    print ("train_set_y : " + str(train_set_y.shape))
    
    print ("\n test_set_x_orig : " + str(test_set_x_orig.shape))
    print ("test_set_y : " + str(test_set_y.shape))        
    
    print ("\n train_set_x_flatten: " + str(train_set_x_flatten.shape))     
    print ("test_set_x_flatten: " + str(test_set_x_flatten.shape))  
    
    print ("\n sanity check after reshaping: " + str(train_set_x_flatten[0:5,0]))
    
    train_set_x = train_set_x_flatten/conversao
    test_set_x = test_set_x_flatten/conversao
    
    return train_set_x, test_set_x


def sigmoid(z):
    """
    Compute the sigmoid of z

    Arguments:
    z -- A scalar or numpy array of any size.

    Return:
    s -- sigmoid(z)
    """

    s = 1 / (1 + np.exp(-z))
    
    return s


def initialize_with_zeros(dim):
    """
    This function creates a vector of zeros of shape (dim, 1) for w and initializes b to 0.
    
    Argument:
    dim -- size of the w vector we want (or number of parameters in this case)
    
    Returns:
    w -- initialized vector of shape (dim, 1)
    b -- initialized scalar (corresponds to the bias)
    """
    
    w = np.zeros((dim, 1))
    b = 0
    assert(w.shape == (dim, 1))
    assert(isinstance(b, float) or isinstance(b, int))
    
    return w, b


def propagate(w, b, X, Y):
    """
    Implement the cost function and its gradient for the propagation explained above

    Arguments:
    w -- weights, a numpy array of size (num_px * num_px * 3, 1)
    b -- bias, a scalar
    X -- data of size (num_px * num_px * 3, number of examples)
    Y -- true "label" vector (containing 0 if non-cat, 1 if cat) of size (1, number of examples)

    Return:
    cost -- negative log-likelihood cost for logistic regression
    dw -- gradient of the loss with respect to w, thus same shape as w
    db -- gradient of the loss with respect to b, thus same shape as b
    
    Tips:
    - Write your code step by step for the propagation. np.log(), np.dot()
    """
    
    m = X.shape[1]
    
    # FORWARD PROPAGATION (FROM X TO COST)
    # compute activation
    A = sigmoid(np.dot(w.T,X) + b) 
    # mostre custo
    cost = (-1/m) * np.sum(  (Y *np.log(A)) + ((1-Y) * np.log(1-A)) )
    
    # BACKWARD PROPAGATION (TO FIND GRAD)
    db = (1/m) * ( np.sum(A-Y) )
    dw = (1/m) * ( np.dot(X,np.subtract(A,Y).T) )
    assert(db.dtype == float)
    #assert(dw.shape == w.shape)
    
    cost = np.squeeze(cost)
    assert(cost.shape == ())

    grads = {"dw": dw,"db": db}
    
    return grads, cost

def optimize(w, b, X, Y, num_iterations, learning_rate, print_cost = False):
    """
    This function optimizes w and b by running a gradient descent algorithm
    
    Arguments:
    w -- weights, a numpy array of size (num_px * num_px * 3, 1)
    b -- bias, a scalar
    X -- data of shape (num_px * num_px * 3, number of examples)
    Y -- true "label" vector (containing 0 if non-cat, 1 if cat), of shape (1, number of examples)
    num_iterations -- number of iterations of the optimization loop
    learning_rate -- learning rate of the gradient descent update rule
    print_cost -- True to print the loss every 100 steps
    
    Returns:
    params -- dictionary containing the weights w and bias b
    grads -- dictionary containing the gradients of the weights and bias with respect to the cost function
    costs -- list of all the costs computed during the optimization, this will be used to plot the learning curve.
    
    Tips:
    You basically need to write down two steps and iterate through them:
        1) Calculate the cost and the gradient for the current parameters. Use propagate().
        2) Update the parameters using gradient descent rule for w and b.
    """
    
    costs = []
    
    for i in range(num_iterations):
                
        # Custo e gradient calculo  
        grads, cost = propagate(w, b, X, Y)
        
        # Retrieve derivatives from grads
        dw = grads["dw"]
        db = grads["db"]
        
        # update rule (≈ 2 lines of code)      
        w = w - (learning_rate * dw)
        b = b - (learning_rate * db)     
        
        # Record the costs
        if i % 100 == 0:
            costs.append(cost)
        
        # nos dados de treinamento, mostre a cada 100 registros o custo dele
        if print_cost and i % 100 == 0:
            print ( "Custo apos iteracao %i: %f" %(i, cost) )
    
    params = {"w": w,"b": b}    
    grads = {"dw": dw,"db": db}
    
    return params, grads, costs


def predict(w, b, X):
    '''
    Predict whether the label is 0 or 1 using learned logistic regression parameters (w, b)
    
    Arguments:
    w -- weights, a numpy array of size (num_px * num_px * 3, 1)
    b -- bias, a scalar
    X -- data of size (num_px * num_px * 3, number of examples)
    
    Returns:
    Y_prediction -- a numpy array (vector) containing all predictions (0/1) for the examples in X
    '''
    
    m = X.shape[1]
    Y_prediction = np.zeros((1,m))
    w = w.reshape(X.shape[0], 1)
    
    # Compute vector "A" predicting the probabilities of a cat being present in the picture 
    A = sigmoid( np.dot(w.T,X) + b ) 
    
    for i in range(A.shape[1]):
        
        # Convert probabilities A[0,i] to actual predictions p[0,i] 
        if (A[0,i] <= 0.5):
            Y_prediction[0,i] = 0
        elif (A[0,i] > 0.5):
            Y_prediction[0,i] = 1
        pass 
    
    assert(Y_prediction.shape == (1, m))
    
    return Y_prediction


def model(X_train, Y_train, X_test, Y_test, num_iterations = 1000, learning_rate = 0.5, print_cost = False):
    """
    Builds the logistic regression model by calling the function you've implemented previously
    
    Arguments:
    X_train -- training set represented by a numpy array of shape (num_px * num_px * 3, m_train)
    Y_train -- training labels represented by a numpy array (vector) of shape (1, m_train)
    X_test -- test set represented by a numpy array of shape (num_px * num_px * 3, m_test)
    Y_test -- test labels represented by a numpy array (vector) of shape (1, m_test)
    num_iterations -- hyperparameter representing the number of iterations to optimize the parameters
    learning_rate -- hyperparameter representing the learning rate used in the update rule of optimize()
    print_cost -- Set to true to print the cost every 100 iterations
    
    Returns:
    d -- dictionary containing information about the model.
    """
      
    # initialize parameters with zeros
    w, b = initialize_with_zeros(X_train.shape[0])

    # Gradient descent  
    parameters, grads, costs = optimize(w, b, X_train, Y_train, num_iterations, learning_rate, print_cost)
    
    # Retrieve parameters w and b from dictionary "parameters"
    w = parameters["w"]
    b = parameters["b"]
    
    # Predict test/train set examples  
    Y_prediction_test = predict(w, b, X_test)
    Y_prediction_train = predict(w, b, X_train)
 
    # mostre accuracy Errors
    print("/n treinamento accuracy: {} %".format(100 - np.mean(np.abs(Y_prediction_train - Y_train)) * 100))
    print("teste accuracy: {} %".format(100 - np.mean(np.abs(Y_prediction_test - Y_test)) * 100))
 
    d = {
         "costs": costs,
         "Y_prediction_test": Y_prediction_test, "Y_prediction_train" : Y_prediction_train, 
         "w" : w, "b" : b,
         "learning_rate" : learning_rate,"num_iterations": num_iterations
         }
 
    return d


def retorna_custo(costs):
    plt.plot(costs)
    plt.title("Learning rate = " + str(d["learning_rate"]))
    plt.ylabel('cost')
    plt.xlabel('iterations (per hundreds)')
    plt.show()
    return plt.show()

#### execulcao ####
    
train_set_x_orig, train_set_y, test_set_x_orig, test_set_y, classes = load_dataset()

train_set_x, test_set_x = load_processed_cat_dataset(train_set_x_orig, train_set_y, test_set_x_orig, test_set_y, classes)

d = model(train_set_x, train_set_y, test_set_x, test_set_y, num_iterations = 1000, learning_rate = 0.005, print_cost = True)
  
custo = retorna_custo(np.squeeze(d['costs'])) 
