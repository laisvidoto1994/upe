#exemplo
#Exemplo Prático 1: Comparar as médias de um grupo de peixes em relação a seu desempenho, 
#sua classificação e sua técnica. Para verificar se existe a mesma variabilidade entre 
#essas três características.


# LEITURA DE DIRETORIO
getwd()

setwd("C:/Users/pos/Documents/ESTATISTICA")

# leia os dados do arquivo e venha com o cabeÃ§alho
dados = read.table("dados.txt", header = TRUE)


boxplot(dados$desempenho ~ dados$tecnica)
boxplot(dados$desempenho ~ dados$classe)

#conseguir comparar dados de desempenho com tecnica e depois desempenho e classe
comparacao = aov(dados$desempenho ~ dados$tecnica + dados$classe)

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

tempo = c(3.0, 7.0, 2.0, 1.5, 12.0)
nota  = c(4.5, 6.5, 3.7, 4.0, 9.3)
 
#realizando regressao, quero saber relacaoo de nota com(~) relacao ao tempo
regrecaoNota = lm(nota~tempo)

#visualizar dados na variavel 
regrecaoNota

#diagrama de dispersao
plot(tempo, nota, main = "teste", type ='o', col='yellow', lwd=2)

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

#realizando regre~Ã§Ã£o, quero saber relaÃ§Ã£o de nota com(~) relaÃ§Ã£o ao tempo
#y=Ã© o problema e x=reposta de y
regrecaoConsumo = lm(consumoY ~ temperaturaX)

regrecaoConsumo

plot(temperaturaX,consumoY)

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

# Construção do Modelo de Regressão
modelo1 = lm(Fertility ~ ., data = treinamento.data)

# Calculo do Valor predito
valoresPreditos1 = predict(modelo1, newdata = data.frame(teste.data))

#Métricas para Avaliar o modelo
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
 
#############
# http://archive.ics.uci.edu/ml/datasets.php

# http://archive.ics.uci.edu/ml/datasets/Automobile

# LEITURA DE DIRETORIO
getwd()

setwd("C:/Users/pos/Downloads")

# leia os dados do arquivo e venha com o cabeÃ§alho
dados = read.table("imports-85.txt", header = TRUE, sep=",")

#############

# http://archive.ics.uci.edu/ml/datasets/Teaching+Assistant+Evaluation

# LEITURA DE DIRETORIO
getwd()

setwd("C:/Users/pos/Downloads")

# leia os dados do arquivo e venha com o cabeÃ§alho
dados = read.table("forestfires.csv", header = TRUE, sep=",")

#############

# tipos de dados e objetos

# criando array de uma linha(1) com(:) 12 valores
x = 1:12

# criando matrix com 3 colunas
xMatriz = matrix(x, ncol = 3)

# criando matrix com 2 linhas
yMatriz = matrix(x, nrow = 2)

# mostra as dimensões do que eu passar(numero de linhas e colunas totais)
dim(xMatriz)

# mostra min,max,mediana,media, quadrante(1,2 e 3) de cada registro da matrix
summary(xMatriz)

#####################

x2 = matrix(10:1, ncol = 2)



#####################

# distribuição randomica
xc = round(runif(10), 2)
yc = round(runif(10), 2)

xy = cbind(xc, yc)

# mostrar o nome das colunas
rownames(xy)

# renomeando o nome das colunas para os respectivos nomes abaixo
colnames(xy)= c("A", "B")

rownames(xy) = 1:10

#mostre apenas o que esta na segunda posição valor da coluna A e B
xy[2,]

# mostre apenas todas as linhas da coluna B
xy[, "B"]
 
# mostra apenas o valor da posição 2 e coluna B
xy[2,"B"]

# mostra apenas o valor da posição 3 e coluna A
xy[3,"A"]


#####################


#criando array
a = array( 1:12, dim = c(3,4) )

vetor = c(1:12)

# tamanho do vetor
length(vetor)

dim(a)

# tipo de dado(numerico,string,...)
mode(a)

# carrega os dados da tabela para deixar disponivel
data(iris)

#abre a tabela na tela
View(iris)

#construção de tabela de dados com os seus respectivos dados(nome de coluna e seus valores)
tabela = data.frame(Nome= c("Pedro", "Paulo","Marcus"), Idade = c(20,30,40) )

# criando lista de dados
dados = list(pai = "Jose", esposa="Maria", n.filhos = 3, idade.filhos= c(4,7,9))

# visualizar dados
dados

# acessando dados do 4º elemento e de posição 2 
dados[[4]][2]

# acessando dados do 4ºelemento
dados[[4]]



#####################
#Exercício

# criando vetores
pais = c("EUA", "Dinamarca", "Holanda", "Espanha", "Brasil")
nome = c("Mauricio", "Pedro", "Aline", "Beatriz", "Marta")
altura = c(1.78, 1.72, 1.63, 1.59, 1.63)
codigo = c(5001, 2183, 4702, 7965, 8890)

# criando um dataframe de diversos vetores
pesquisa = data.frame(pais, nome, altura, codigo)

olhos = c("verde", "azul", "azul", "castanho", "castanho")

# cbind->adicionando coluna de olhos + dados da tabela pesquisa em pesq
pesq = cbind(pesquisa, olhos)

# numero de linhas e colunas totais da tabela
dim(pesq)

# traz todos os valores da coluna pais
pesq$pais

# traz todos os valores da coluna nome
pesq$nome

# traz o valor da 1º linha e 1º coluna

pesq[1,1]
# traz o valor da 3º linha e 2º coluna
pesq[3,2]

# numero total de linhas
nrow(pesq)

#numero total de colunas
ncol(pesq)

#traga todos os valores das colunas, quando altura for menor que 1.60
pesq[ altura < 1.60,]

#traga apenas os valores das colunas de codigo e olhos, quando altura for menor que 1.60
pesq[ altura < 1.60, c('codigo', 'olhos')]


# renomeando o nome das colunas
names(pesq) = c("País", "Nome", "Altura", "Codigo", "Olhos")

colnames(pesq) = c("Var 1", "Var 2", "Var 3", "Var 4", "Var 5")

rownames(pesq) = c("Obs 1", "Obs 2", "Obs 3", "Obs 4", "Obs 5")


x=25

if(x < 30){
  "Esse numero é menor que 30"
}else{
  "Esse numero é menor que 30"
}

x2 = 7

if(x < 7){
  "Esse numero é menor que 7"
} else if(x == 7){
  "esse é o numero 7"
}else{
  "Esse numero é maior que 7"
}


# loop - for
# inicie em 1 e va ate 20
for(i in 1:20){
  print(i)
}

#rnorm-> constroi numeros randomicos aleatorios
for(q in rnorm(10)){
  print(q)
}


x3 = 1

while(x3 <5){
  x3 = x3 + 1
  print(x3)
}


# funções


# criando funções
myFunction1 = function(x){
  print(x)
  r=x + x
  print(r)
}

myFunction1(10)

class(myFunction1)


myFunction2 = function(a, b){
  valor = a ^ b
  print(valor)
}

myFunction2(3, 2)


jogando_dados = function(){
  num = sample(1:6, size = 1)
  num
}

jogando_dados()


myFunction3 = function(x, y){
  ifelse( y < 7, x+y, "não encontrado" )
}


myFunction3(4,2)
myFunction3(40,7)



##########################

# importar csx

install.packages("readr")
install.packages("dplyr")

install.packages("stats")
install.packages("base")

library(readr)
library(dplyr)

library(stats)
library(base)

meu_arquivo = read_csv(file.choose())


# importando arquivos
df_sono = read_csv("C:/Users/Edna Soares/Desktop/Nova pasta/upe/05 - Estatistica Computacional/sono.csv")
 
meu_arquivo = read_delim(file.choose(), sep = ",")
 
df1 = read_table("temperaturas.txt", col_names = "DAY", "MONTH", "YEAR", "TEMP")

count(df_sono, cidade)

sample_n(df_sono, size = 10)

# criando filtros

#traga os valores das colunas quando a coluna sono_total for menor ou igual á 16
filter(df_sono, sono_total >= 16)

#traga os valores das colunas quando a coluna sono_total for menor ou igual á 16 e peso maior ou igual á 80
filter(df_sono, sono_total >= 16, peso >= 80)

#traga os valores das colunas quando a coluna cidade for Recife e/ou Curitiba
filter(df_sono, cidade %in% c("Recife", "Curitiba"))


df_sono %>% summarise( media_sono = mean(sono_total) )

df_sono %>% summarise( media_sono = mean(sono_total), min_sono = min(min_sono), max_ssono = max(sono_total), total = n() )



 