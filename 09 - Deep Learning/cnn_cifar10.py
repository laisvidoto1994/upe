'''Trains a simple convnet on the MNIST dataset.
Gets to 99.25% test accuracy after 12 epochs
(there is still a lot of margin for parameter tuning).
16 seconds per epoch on a GRID K520 GPU.
'''

from __future__ import print_function
import keras
from keras.datasets import cifar10
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K

#batch_size-> quantidade de registros a cada iteração
batch_size = 128
# num_classes-> é o rotulo que representa o que ele é realmente
num_classes = 10
#epochs-> quantidade de epocas que ele vai iterar
epochs = 12

# input image dimensions
img_rows, img_cols = 32, 32

# the data, split between train and test sets
#carregamento dos dados
(x_train, y_train), (x_test, y_test) = cifar10.load_data()
 
# convertendo os dados inteiro para matriz do tipo float
x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255
print('x_train shape:', x_train.shape)
print(x_train.shape[0], 'train samples')
print(x_test.shape[0], 'test samples')

# convert class vectors to binary class matrices
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)

#input_shape-> formato da imagem é 32 na horizontal, 32 na vertical, 3 é o formato rgb
input_shape = (32,32,3)

#criado modelo 
model = Sequential()

### adicionando camadas ao modelo###
#convolucional com 32 filtros, tamanho de cada filtro sera 3por3,
#activation='relu'-> se o numero for maior que 0 ele coloca 1, se for igual ou menor que 0 ele coloca 0
model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=input_shape) )				 
model.add(Conv2D(64, (3, 3), activation='relu') )
#MaxPooling2D-> não tem peso, só pega o maior valor
model.add(MaxPooling2D(pool_size=(2, 2) ) )
#Dropout-> desliga em porcentagem alguns neuronios em cada iteração, para que o neuronio não fique super ajustado ou especializa
model.add(Dropout(0.25) )
model.add(Dropout(0.5) ) 
#Flatten->transforma o dado bidimencional(extrai caracteristicas), em dimencional(transforma em vetor) 
model.add(Flatten() )
#Dense->
#activation='relu'-> se o numero for maior que 0 ele coloca 1, se for igual ou menor que 0 ele coloca 0
#activation='softmax'-> 
model.add(Dense(128, activation='relu') )  
model.add(Dense(num_classes, activation='softmax') )

#
model.compile(loss=keras.losses.categorical_crossentropy, optimizer=keras.optimizers.Adadelta(), metrics=['accuracy'] )
			  
#
model.fit(x_train, y_train, batch_size=batch_size, epochs=epochs, verbose=1, validation_data=(x_test, y_test) )
		  
#		  
score = model.evaluate(x_test, y_test, verbose=0)
print('Test loss:', score[0])
print('Test accuracy:', score[1])
