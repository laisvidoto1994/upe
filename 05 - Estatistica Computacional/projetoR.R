#-------------------------------------------------------------#
# API do Projeto
#-------------------------------------------------------------#
#http://archive.ics.uci.edu/ml/datasets/Auto+MPG

#-------------------------------------------------------------#
#Attribute Information:
#-------------------------------------------------------------#

#1. mpg: contÃ­nuo->consumo de combustÃ­vel do ciclo urbano em milhas por galÃ£o
#2. cilindros: discreto com vÃ¡rios valores 
#3. deslocamento: contÃ­nuo 
#4. cavalo-vapor: contÃ­nuo 
#5. peso: contÃ­nuo 
#6. aceleraÃ§Ã£o: contÃ­nuo 
#7. ano modelo: discreto com mÃºltiplos valores 
#8. origem: discreto com mÃºltiplos valores 
#9. nome do carro: string (Ãºnico para cada instÃ¢ncia)

#-------------------------------------------------------------#
# Quais análises deverão ser feitas?      
#-------------------------------------------------------------#

# OK - Identificar a amplitude de cada uma das varia??veis; 
# OK - Calcular me??dia, moda e mediana para cada uma das varia??veis nume??ricas; 
# OK - Calcular variância e desvio padra~o para cada uma das varia??veis; 
# OK - Plotar o melhor gra??fico para cada uma das varia??veis; 
# OK - Plotar o boxplot para todas as varia??veis quantitativas; 
# - Calcular a correlac??a~o e plotar o gra??fico de dispersa~o;
# - Formular um problema de regressão e análisa-lo como também discuti-lo;
# - Realizar teste de normalidade usando boxplot, histograma e shapiro.test, discutir os resultados;
# - Formular teste de hipótese e Anova, discutir os resultados;

#-------------------------------------------------------------#
# Leitura de Arquivos txt       
#-------------------------------------------------------------#

# leitura de diretorio
getwd()

# onde o arquivo esta
setwd("C:/Users/Edna Soares/Desktop/Nova pasta/upe/05 - Estatistica Computacional")

# leia os dados do arquivo e venha com o cabeçalho
leituraArquivo = read.table("auto-mpg.txt", header = TRUE)

#renomeando o nome das colunas da tabela leituraArquivo
colnames(leituraArquivo) = c("mpg", "cilindros", "deslocamento", "cavaloVapor", "peso", "aceleracao", "anoModelo","origem", "nomeCarro" )
 
#-------------------------------------------------------------#
# trazendo apenas as colunas que eu queiro        
#-------------------------------------------------------------#

# trazendo apenas as colunas que eu queiro
dados = cbind.data.frame(leituraArquivo$mpg,leituraArquivo$cilindro,leituraArquivo$deslocamento,leituraArquivo$peso,leituraArquivo$aceleracao,leituraArquivo$anoModelo)

#renomeando o nome das colunas da tabela dados
colnames(dados) = c("mpg", "cilindros", "deslocamento", "peso", "aceleracao", "anoModelo")

#-------------------------------------------------------------#
# amplitude de cada variavel quantitativa       
#-------------------------------------------------------------#

amplitudeMpg          = ( range(dados$mpg)[2]          - range(dados$mpg)[1] ) 
amplitudeCilindros    = ( range(dados$cilindros)[2]    - range(dados$cilindros)[1] )  
amplitudeDeslocamento = ( range(dados$deslocamento)[2] - range(dados$deslocamento)[1] )  
amplitudePeso         = ( range(dados$peso)[2]         - range(dados$peso)[1] )  
amplitudeAceleracao   = ( range(dados$aceleracao)[2]   - range(dados$aceleracao)[1] )  
amplitudeAnoModelo    = ( range(dados$anoModelo)[2]    - range(dados$anoModelo)[1] )  

#-------------------------------------------------------------#
# min,max,mediana,media dos dados        
#-------------------------------------------------------------#

# visualiza dados(min,max,mediana,media)
summary(dados)

#-------------------------------------------------------------#
# variançia        
#-------------------------------------------------------------#
var(dados)
varianciaMpg          = var(dados$mpg)
varianciaCilindros    = var(dados$cilindros)
varianciaDeslocamento = var(dados$deslocamento)
varianciaPeso         = var(dados$peso)
varianciaAceleracao   = var(dados$aceleracao)
varianciaAnoModelo    = var(dados$anoModelo)

#-------------------------------------------------------------#
# desvio padrao
#-------------------------------------------------------------#
desvioPadraoMpg          = sd(dados$mpg)
desvioPadraoCilindros    = sd(dados$cilindros)
desvioPadraoDeslocamento = sd(dados$deslocamento)
desvioPadraoPeso         = sd(dados$peso)
desvioPadraoAceleracao   = sd(dados$aceleracao)
desvioPadraoAnoModelo    = sd(dados$anoModelo)

#-------------------------------------------------------------#
# o melhor grafico para cada variavel quantitativa        
#-------------------------------------------------------------#

# grafico de linha
plot(dados$cilindros, dados$mpg, main = "consumo combustivel X Qtd. Cilindros", type="o", col="blue",lwd=1, xlab="Cilindro", ylab="Mpg")

# grafico de histograma
hist(dados$mpg, main="Mpg", xlab = "Mpg")
hist(dados$cilindros, main="Cilindros", xlab = "Cilindros")
hist(dados$deslocamento, main="Deslocamento", xlab = "Deslocamento")
hist(dados$peso, main="Peso", xlab = "Peso")
hist(dados$aceleracao, main="Aceleração", xlab = "Aceleração")
hist(dados$anoModelo, main="Ano Modelo", xlab = "Ano Modelo")

#-------------------------------------------------------------#
# graficos das variaveis quantitativas        
#-------------------------------------------------------------#

boxplot(dados$mpg ~ dados$cilindros, xlab = "Cilindro", ylab = "Mpg")
boxplot(dados$mpg ~ dados$deslocamento, xlab = "Deslocamento", ylab = "Mpg")
boxplot(dados$mpg ~ dados$peso, xlab = "Peso", ylab = "Mpg")
boxplot(dados$mpg ~ dados$aceleracao, xlab = "Aceleracao", ylab = "Mpg")
boxplot(dados$mpg ~ dados$anoModelo, xlab = "Ano Modelo", ylab = "Mpg")

#-------------------------------------------------------------#
# Correlação       
#-------------------------------------------------------------#

# para saber qual tem o maior coleração entre a coluna mpg
corelacaoDeMPG = cor(dados)
corelacaoDeMPG

library(corrplot)

#correlacção nome das variaveis
corrplot(corelacaoDeMPG, method="circle", type = "upper", title = "Dispersão dos Dados")

#-------------------------------------------------------------#
# partição dos dados em teste e treinamento        
#-------------------------------------------------------------#
  
library(lattice)
library(ggplot2)
library(caret)

#Criando os índices para Holdout
indice = createDataPartition(dados$mpg, p=2/3, list = FALSE)

# Dividindo dados em variaveis treinamento e teste
treinamentoDados = dados[indice,]
testeDados = dados[-indice,]

#-------------------------------------------------------------#
# Modelo de Regressão 1 - comparação do mpg com todos os dados   
#-------------------------------------------------------------#

# Construção do Modelo de Regressão(comparando mpg com todos)
modelo1 = lm(mpg ~ ., data = treinamentoDados)

# Calculo do Valor predito
valoresPreditos1 = predict(modelo1, newdata = data.frame(testeDados) )
 
# Métricas para Avaliar o modelo
modeloAjustado1 = R2(valoresPreditos1, testeDados$mpg)
ErroAbsoluto1   = MAE(valoresPreditos1, testeDados$mpg)

#y= a+b*x
x=dados$cilindros[1]
Yestimado = modelo1$coefficients[1] + modelo1$coefficients[2]*x #-> para deslocamento

#diagrama de dispersao
plot( dados$cilindros,dados$mpg, main = "dispersão mpg X cilindros", xlab ="Cilindro",ylab = "Mpg" )

#criacao da linha do grafico de resposta da regressao
abline(modelo1)

#diagrama de dispersao
plot(fitted(modelo1), main = "diagrama de dispersão1", residuals(modelo1), xlab="Valores Ajustados", ylab="Resíduos")

#-------------------------------------------------------------#
# Modelo de Regressão 2 - 3 maiores         
#-------------------------------------------------------------#

# Construção do Modelo de Regressão(comparando mpg com todos)
modelo2 = lm(mpg ~ cilindros,aceleracao,anoModelo, data = treinamentoDados)

# Calculo do Valor predito
valoresPreditos2 = predict(modelo2, newdata = data.frame(testeDados) )

# Métricas para Avaliar o modelo
modeloAjustado2 = R2(valoresPreditos2, testeDados$mpg)
ErroAbsoluto2   = MAE(valoresPreditos2, testeDados$mpg)

#diagrama de dispersao
plot( dados$cilindros, dados$mpg, main = "D")

#criacao da linha do grafico de resposta da regressao
abline(modelo2)

#diagrama de dispersao
plot(fitted(modelo2), main = "diagrama de dispersão2", residuals(modelo2), xlab="Valores Ajustados", ylab="Resíduos")
abline(modelo2)

#-------------------------------------------------------------#
# Modelo de Regressão 3 - o maior        
#-------------------------------------------------------------#

# Construção do Modelo de Regressão(comparando mpg com todos)
modelo3 = lm(mpg ~ cilindros, data = treinamentoDados)

# Calculo do Valor predito
valoresPreditos3 = predict(modelo3, newdata = data.frame(testeDados) )

# Métricas para Avaliar o modelo
modeloAjustado3 = R2(valoresPreditos3, testeDados$mpg)
ErroAbsoluto3   = MAE(valoresPreditos3, testeDados$mpg)

#diagrama de dispersao
plot( dados$cilindros, dados$mpg)

#criacao da linha do grafico de resposta da regressao
abline(modelo3)

#diagrama de dispersao
plot(fitted(modelo3), main = "diagrama de dispersão3", residuals(modelo3), xlab="Valores Ajustados", ylab="Resíduos")

#-------------------------------------------------------------#
# teste de normalidade      
#-------------------------------------------------------------#

#Teste de Normalidade Shapiro-Wilk
shapiroNormalidadeY1 = shapiro.test(valoresPreditos1)
shapiroNormalidadeY1

# Kolmogorov-Smirnov
ks.test(valoresPreditos1, "pnorm", mean(valoresPreditos1), sd(valoresPreditos1))
hist(valoresPreditos1)

#Teste de Normalidade Shapiro-Wilk
shapiroNormalidadeY2 = shapiro.test(valoresPreditos2)
shapiroNormalidadeY2

# Kolmogorov-Smirnov
ks.test(valoresPreditos2, "pnorm", mean(valoresPreditos2), sd(valoresPreditos2))
hist(valoresPreditos2)

#Teste de Normalidade Shapiro-Wilk
shapiroNormalidadeY3 = shapiro.test(valoresPreditos3)
shapiroNormalidadeY3

# Kolmogorov-Smirnov
ks.test(valoresPreditos3, "pnorm", mean(valoresPreditos3), sd(valoresPreditos3))
hist(valoresPreditos3)

#-------------------------------------------------------------#
# teste de hipotese      
#-------------------------------------------------------------#

# alternativas-> "two.sided", "less"-> menos, "greater"->maior
# nivel de confidencialidade = 95%-> conf.level = 0.95
t.test(valoresPreditos1,valoresPreditos2, alternative="less", conf.level = 0.95)
t.test(valoresPreditos1,valoresPreditos3, alternative="less", conf.level = 0.95)
t.test(valoresPreditos2,valoresPreditos3, alternative="less", conf.level = 0.95)

#-------------------------------------------------------------#
# teste de Anova       
#-------------------------------------------------------------#

#conseguir comparar dados de consumo de gasolina com mpg e depois cilindros e deslocamento
testeAnova = aov(dados$mpg ~ dados$cilindros + dados$deslocamento + dados$peso)

#dados da tabela dotipo Anova
summary(testeAnova)#99,9% em valor 0.001-1*100
