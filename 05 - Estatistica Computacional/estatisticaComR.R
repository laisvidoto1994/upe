# LEITURA DE DIRETORIO
getwd()

setwd("C:/Users/pos/Documents/ESTATISTICA")

# leia os dados do arquivo e venha com o cabeçalho
dados = read.table("dados.txt", header = TRUE)


boxplot(dados$desempenho ~ dados$tecnica)


boxplot(dados$desempenho ~ dados$classe)

#conseguir comparar dados de desempenho com tecnica e depois desempenho e classe
comparacao = aov(dados$desempenho ~ dados$tecnica + dados$classe)

summary(comparacao)

###########################

# regressão(lm)linear model

#x= atibutos que melhor explica o y 
#y=f(x)

#equação d regressão
 #y=a+bX
#a=valor que a reta pode bater em y
#bX=inclinação



##########################

tempo = c(3.0, 7.0, 2.0, 1.5, 12.0)
nota  = c(4.5, 6.5, 3.7, 4.0, 9.3)

#diagrama de dispersao
plot(tempo, nota, main = "teste", type ='o', col='blue', lwd=3)

#realizando regre~ção, quero saber relação de nota com(~) relação ao tempo
regrecaoNota = lm(nota~tempo)

#visualizar dados na variavel 
regrecaoNota

#
plot(tempo,nota)

#criação da linha do grafico de resposta da regreção
abline(regrecaoNota)

#valores ajustados e são guardados na variavel(fitted.values)
regrecaoNota$fitted.values

#mostra o valor de erro do real - o valor estimado da regrecaoNota
regrecaoNota$residuals

ErroMedioAbsoluto = mean( abs(regrecaoNota$residuals) )


######################


temperaturaX = c(16,31,38,39,37,36,36,22,10)
consumoY     = c(290,374,393,425,406,370,365,320,269)

#diagrama de dispersao
plot(temperaturaX, consumoY, main = "teste", type ='o', col='blue', lwd=3)

#realizando regre~ção, quero saber relação de nota com(~) relação ao tempo
#y=é o problema e x=reposta de y
regrecaoConsumo = lm(consumoY ~ temperaturaX)

regrecaoConsumo

plot(temperaturaX,consumoY)

abline(regrecaoConsumo)

# intercept-> 217.366 temperaturaX-> 4.739
YEstimado = regrecaoConsuo$coefficients[1] + regrecaoConsumo$coefficients[2] * temperaturaX

YEstimado

# se temperatura for 25ºC?
# y = a + (b*X)
# a = regrecaoConsuo$coefficients[1]
# b = regrecaoConsumo$coefficients[2]
# x = temperaturaX
#y=217,37+(4,74*25)-> y=217,37+(118,5)->y=335,87



plot(fitted(regrecaoNota), residuals(regrecaoNota), xlab = "valores ajustados", ylab = "residuos")

##################################

library(caret)
library(lattice)
library(ggplot2)

data("swiss")

set.seed(123)

indice = createDataPartition(swiss$Fertility, p=2/3, list = FALSE)

treinamento.data = swiss[indice,]

teste.data = swiss[-indice,]

#modelo de regressão
modelo1= lm(Fetility ~ ., data=treinamento.data)

valoresPreditos1 = predict(modelo1, newdata= data.frame(teste.data))

modeloAjustado1 = R2(valoresPreditos1, teste.data$Fertility)

ErroAbsoluto = MAE(valoresPreditos1, teste.data$Fertility)

ErroMedioQuadratico1 = RMSE(valoresPreditos1, teste.data$Fertility)


metodo2 = trainControl(method="LOOCV")

modelo2 = train(Fertility ~ ., data= data.frame(treinamento.data), method="lm", trControl=metodo2)

valoresPreditos2 = predict(modelo2, newdata=data.frame(teste.data))

#quanto ele é bom
modeloAjustado2 = R2(valoresPreditos2, teste.data$Fertility)

#quanto ele erou em prever os valores
ErroAbsoluto2 = MAE(valoresPreditos2, teste.data$Fertility)

ErroMedioQuadratico2 = RMSE(valoresPreditos2, teste.data$Fertility)

##############################
# http://archive.ics.uci.edu/ml/datasets.php

# http://archive.ics.uci.edu/ml/datasets/Automobile

# LEITURA DE DIRETORIO
getwd()

setwd("C:/Users/pos/Downloads")

# leia os dados do arquivo e venha com o cabeçalho
dados = read.table("imports-85.txt", header = TRUE, sep=",")







