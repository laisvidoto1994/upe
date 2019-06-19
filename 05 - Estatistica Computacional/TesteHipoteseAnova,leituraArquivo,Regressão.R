# Exemplo Prático 1: Comparar as médias de um grupo de peixes
# em relação a seu desempenho, sua classificação e sua técnica. 
# Para verificar se existe a mesma variabilidade entre 
# essas três características.

# leitura de diretorio
getwd()

# caminho do arquivo
setwd("C:/Users/pos/Documents/ESTATISTICA")

# leia os dados do arquivo e venha com o cabeÃ§alho
dados = read.table("tiposPeixes.txt", header = TRUE)
 
# grafico
boxplot(dados$desempenho ~ dados$tecnica)
boxplot(dados$desempenho ~ dados$classe)

# teste de hipotese - ANOVA 
#conseguir comparar dados de desempenho com tecnica e depois desempenho e classe
comparacao = aov(dados$desempenho ~ dados$tecnica + dados$classe)

# mostre os dados dessa comparação
summary(comparacao)

###########################

# regressÃ£o(lm)linear model

#x= atibutos que melhor explica o y 
#y=f(x)

#equaÃ§Ã£o d regressÃ£o
 #y=a+bX
#a=valor que a reta pode bater em y
#bX=inclinaÃ§Ã£o 

##########################
#Exemplo 1: nota da prova e tempo de estudo

tempoX = c(3.0, 7.0, 2.0, 1.5, 12.0)
notaY  = c(4.5, 6.5, 3.7, 4.0, 9.3)

# Regressão 
#realizando regressao, quero saber relacaoo de nota com(~) relacao ao tempo
regrecaoNota = lm(notaY ~ tempoX)

#visualizar dados na variavel 
regrecaoNota

#diagrama de dispersao
plot(tempoX, notaY, main = "Dispersão", type ='o', col='yellow', lwd=2)

#criacao da linha do grafico de resposta da regressao
abline(regrecaoNota)

#y= a+b*x
#Yestimado = 2.9130 + 0.5269*x

#valores ajustados e sao guardados na variavel(fitted.values)
regrecaoNota$fitted.values

#Erro do Modelo = yReal - ValorAjustado

#mostra o valor de erro do real - o valor estimado da regrecaoNota
regrecaoNota$residuals

ErroMedioAbsoluto = mean( abs(regrecaoNota$residuals) )

plot(fitted(regrecaoNota), residuals(regrecaoNota), xlab="Valores Ajustados", ylab="Resíduos")

######################
#Exemplo 2: consumo de cerveja e  temperatura

temperaturaX = c(16,31,38,39,37,36,36,22,10)
consumoY     = c(290,374,393,425,406,370,365,320,269)

#diagrama de dispersao
plot(temperaturaX, consumoY, main = "teste", type ='o', col='blue', lwd=3)

# Regressão
#realizando regre~Ã§Ã£o, quero saber relaÃ§Ã£o de nota com(~) relaÃ§Ã£o ao tempo
#y=Ã© o problema e x=reposta de y
regrecaoConsumo = lm(consumoY ~ temperaturaX)

regrecaoConsumo

plot(temperaturaX, consumoY)

abline(regrecaoConsumo)

# intercept-> 217.366 temperaturaX-> 4.739
YEstimado = regrecaoConsuo$coefficients[1] + regrecaoConsumo$coefficients[2] * temperaturaX

YEstimado

# Qual o consumo previsto para uma temperatura de 25ºC?
# y = a + (b*X)
# a = regrecaoConsuo$coefficients[1]
# b = regrecaoConsumo$coefficients[2]
# x = temperaturaX
#y=217,37+(4,74*25)-> y=217,37+(118,5)->y=335,87litros

plot(fitted(regrecaoConsumo), residuals(regrecaoConsumo), xlab = "valores ajustados", ylab = "residuos")

#Valores Ajustados
regrecaoConsumo$fitted.values

regrecaoConsumo$residuals

plot(fitted(regrecaoConsumo),residuals(regrecaoConsumo),xlab="Valores Ajustados",ylab="Resíduos")


##################################
#### HoldOut (Construção do Modelo de Regressão)

library(caret)#Facilitar a partição dos dados
library(lattice)
library(ggplot2)

#Carregando os dados
data("swiss")

#Setando uma semente
set.seed(123)


#Criando os índices para Holdout
# traga 2/3 dos dados
indice = createDataPartition(swiss$Fertility, p=2/3, list = FALSE)

# Dividindo dados em variaveis treinamento e teste
treinamento.data = swiss[indice,]
teste.data = swiss[-indice,]


# Construção do Modelo de Regressão1
modelo1 = lm(Fertility ~ ., data = treinamento.data)

# Calculo do Valor predito
valoresPreditos1 = predict(modelo1, newdata = data.frame(teste.data) )

# Métricas para Avaliar o modelo
modeloAjustado1      = R2(valoresPreditos1, teste.data$Fertility)
ErroAbsoluto         = MAE(valoresPreditos1, teste.data$Fertility)
ErroMedioQuadratico1 = RMSE(valoresPreditos1, teste.data$Fertility)

########################
#### Leave one out

#Definição da Partição de Dados
metodo2 = trainControl(method="LOOCV")

modelo2 = train(Fertility ~ ., data = data.frame(treinamento.data), method="lm", trControl=metodo2)

# Calculo do Valor predito
valoresPreditos2 = predict(modelo2, newdata = data.frame(teste.data) )

#Métricas para Avaliar o modelo
modeloAjustado2      = R2(valoresPreditos2, teste.data$Fertility)
ErroAbsoluto2        = MAE(valoresPreditos2, teste.data$Fertility)
ErroMedioQuadratico2 = RMSE(valoresPreditos2, teste.data$Fertility)

##############################
#### Validação Cruzada com K fold

#criando validação cruzada
metodoCV = trainControl(method="cv", number=10)

modelo3 = train(Fertility~ ., data= data.frame(treinamento.data), method="lm", trControl= metodoCV)

# Calculo do Valor predito
valoresPreditos3= predict(modelo3, newdata= data.frame(teste.data))

# metricas para validar o modelo
modeloAjustado3      = R2(valoresPreditos3, teste.data$Fertility)
ErroAbsoluto3        = MAE(valoresPreditos3, teste.data$Fertility)
ErroMedioQuadratico3 = RMSE(valoresPreditos3, teste.data$Fertility)
 
