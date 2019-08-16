'''Trains a simple convnet on the MNIST dataset.
Gets to 99.25% test accuracy after 12 epochs
(there is still a lot of margin for parameter tuning).
16 seconds per epoch on a GRID K520 GPU.
'''

from __future__ import print_function
import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K
from scipy import misc
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc
from cryptography.hazmat.primitives import padding

batch_size = 128
# se é face ou não é
num_classes = 2
epochs = 12

# input image dimensions
X_train = []
y_train = []
# lendo arquivo de treino
for i in range (1,1001):
    face = misc.imread('C:/Users/Bruno/Documents/BDs/CBCL-histeq/train/face/histeq/'+str(i)+'.jpg')
	# 19por19,1 monocromatica
    X_train.append(face.reshape(19, 19, 1))
    y_train.append([1,0]) 
	
	nonface = misc.imread('C:/Users/Bruno/Documents/BDs/CBCL-histeq/train/non-face/histeq/'+str(i)+'.jpg')
    X_train.append(nonface.reshape(19, 19, 1))
    y_train.append([0,1]) 
	  	
X_val = []
y_val = []
#lendo arquivo de teste
for i in range (1001,2430):
    face = misc.imread('C:/Users/Bruno/Documents/BDs/CBCL-histeq/train/face/histeq/'+str(i)+'.jpg')
    X_val.append(face.reshape(19, 19, 1))
    y_val.append([1,0]) 
	
for i in range (1001,4545):
    nonface = misc.imread('C:/Users/Bruno/Documents/BDs/CBCL-histeq/train/non-face/histeq/'+str(i)+'.jpg')
    X_val.append(nonface.reshape(19, 19, 1))
    y_val.append([0,1]) 
	
X_test = []
y_test = []

# lendo da pasta de teste
for i in range (1,473):
    face = misc.imread('C:/Users/Bruno/Documents/BDs/CBCL-histeq/test/face/histeq/'+str(i)+'.jpg')
    X_test.append(face.reshape(19, 19, 1))
    y_test.append([1,0]) 
	
for i in range (1,23574):
    nonface = misc.imread('C:/Users/Bruno/Documents/BDs/CBCL-histeq/test/non-face/histeq/'+str(i)+'.jpg')
    X_test.append(nonface.reshape(19, 19, 1))
    y_test.append([0,1]) 
	
# normalize inputs from 0-255 to 0-1
X_train = np.array(X_train).astype('float32')
X_val = np.array(X_val).astype('float32')
X_test = np.array(X_test).astype('float32')

y_train = np.array(y_train).astype('float32')
y_val = np.array(y_val).astype('float32')
y_test = np.array(y_test).astype('float32')

X_train = X_train / 255
X_val = X_val / 255
X_test = X_test / 255
num_classes = 2

model = Sequential()
model.add(Conv2D(32, kernel_size=(3, 3), strides=(1,1), padding="same", activation='relu',input_shape=(19,19,1)))
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(num_classes, activation='softmax'))

model.compile(loss=keras.losses.categorical_crossentropy,
              optimizer=keras.optimizers.Adadelta(),
              metrics=['accuracy'])

model.fit(X_train, y_train,
          batch_size=batch_size,
          epochs=epochs,
          verbose=1,
          validation_data=(X_test, y_test))

def generate_results(y_test, y_score):
    fpr, tpr, _ = roc_curve(y_test, y_score)
    roc_auc = auc(fpr, tpr)
    plt.figure()
    plt.plot(fpr, tpr, label='ROC curve (area = %0.2f)' % roc_auc)
    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlim([0.0, 1.05])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver operating characteristic curve')
    plt.show()
    print('AUC: %f' % roc_auc)
	
# Final evaluation of the model
y_score = model.predict(X_test)
generate_results(y_test[:, 0], y_score[:, 0])