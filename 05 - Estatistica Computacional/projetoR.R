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
# LEITURA DE DIRETORIO
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
# min,max,mediana,media dos dados        
#-------------------------------------------------------------#

# visualiza dados(min,max,mediana,media)
summary(dados)

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
desvioPadrao = sd(dados)

desvioPadraoMpg          = sd(dados$mpg)
desvioPadraoCilindros    = sd(dados$cilindros)
desvioPadraoDeslocamento = sd(dados$deslocamento)
desvioPadraoPeso         = sd(dados$peso)
desvioPadraoAceleracao   = sd(dados$aceleracao)
desvioPadraoAnoModelo    = sd(dados$anoModelo)

#-------------------------------------------------------------#
# graficos das variaveis quantitativas        
#-------------------------------------------------------------#

boxplot(dados$mpg ~ dados$cilindros)
boxplot(dados$mpg ~ dados$deslocamento)
boxplot(dados$mpg ~ dados$peso)
boxplot(dados$mpg ~ dados$aceleracao)
boxplot(dados$mpg ~ dados$anoModelo)

#-------------------------------------------------------------#
# o melhor grafico para cada variavel quantitativa        
#-------------------------------------------------------------#

# grafico de linha
#plot(dados$anoModelo, main = "teste", type="o", col="blue",lwd=1, xlab="matriculado", ylab="ano", sub="subtitulo do grafico")

# grafico de barras
#barplot(dados$cilindros)

# construindo grafico de pizza
# pie(dados$anoModelo, main="titulo")

#boxplot(dados$mpg, dados$cilindros) 

# grafico de histograma
hist(dados$mpg, main="teste")
hist(dados$cilindros, main="teste")
hist(dados$deslocamento, main="teste")
hist(dados$peso, main="teste")
hist(dados$aceleracao, main="teste")
hist(dados$anoModelo, main="teste")

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

#valor de intercept
modelo1$coefficients[1] 

# valor do x = cilindros
modelo1$coefficients[2] 

# valor do x = deslocamento          
modelo1$coefficients[3] 

# valor do x = peso          
modelo1$coefficients[4]

# valor do x = aceleracao          
modelo1$coefficients[5]

# valor do x = anoModelo          
modelo1$coefficients[5]

# Calculo do Valor predito
valoresPreditos1 = predict(modelo1, newdata = data.frame(testeDados) )
 
# Métricas para Avaliar o modelo
modeloAjustado1      = R2(valoresPreditos1, testeDados$mpg)
ErroAbsoluto         = MAE(valoresPreditos1, testeDados$mpg)
ErroMedioQuadratico1 = RMSE(valoresPreditos1, testeDados$mpg)

#y= a+b*x
x=dados$cilindros[1]
Yestimado = modelo1$coefficients[1] + modelo1$coefficients[2]*x #-> para deslocamento
#Yestimado = -16.042718 + 0.211716*x-> para aceleracao

#(Intercept)->-16.042718 
#cilindros-> -0.201211
#deslocamento-> 0.009095
#peso-> -0.007048    
#aceleracao-> 0.211716  
#anoModelo -> 0.742954

#diagrama de dispersao
plot(dados$mpg, dados$cilindros)

#criacao da linha do grafico de resposta da regressao
abline(modelo2)

#Valores Ajustados
modelo1$fitted.values
   
#-------------------------------------------------------------#
# Modelo de Regressão 2 - 3 maiores         
#-------------------------------------------------------------#

#Definição da Partição de Dados
metodo2 = trainControl(method="LOOCV")

modelo2 = train(mpg ~ ., data = data.frame(treinamentoDados), method="lm", trControl=metodo2)

# Calculo do Valor predito
valoresPreditos2 = predict(modelo2, newdata = data.frame(testeDados) )

#Métricas para Avaliar o modelo
modeloAjustado2      = R2(valoresPreditos2, testeDados$mpg)
ErroAbsoluto2        = MAE(valoresPreditos2, testeDados$mpg)
ErroMedioQuadratico2 = RMSE(valoresPreditos2, testeDados$mpg)

#-------------------------------------------------------------#
# Modelo de Regressão 3 - o maior        
#-------------------------------------------------------------#


#-------------------------------------------------------------#
# Correlação       
#-------------------------------------------------------------#

# para saber qual tem o maior coleração entre a coluna mpg
corelacaoDeMPG = cor(dados$mpg, dados$cilindros)
corelacaoDeMPG

#-------------------------------------------------------------#
# Grafico de Dispersão       
#-------------------------------------------------------------#
#Valores Ajustados
modelo1$fitted.values

#mostra o valor de erro do real - o valor estimado da regrecaoNota
modelo1$residuals

#diagrama de dispersao
plot(fitted(modelo1), residuals(modelo1), xlab="Valores Ajustados", ylab="Resíduos")

#-------------------------------------------------------------#
# teste de hipótese e Anova       
#-------------------------------------------------------------#

#conseguir comparar dados de consumo de gasolina com mpg e depois cilindros e deslocamento
comparacao1 = aov(dados$mpg ~ dados$cilindros + dados$deslocamento + dados$peso)

#dados da tabela dotipo Anova
summary(comparacao1)

comparacao2 = aov(dados$mpg ~ dados$cilindros + dados$aceleracao + dados$anoModelo)

#dados da tabela dotipo Anova
summary(comparacao2)

# alternativas-> "two.sided", "less"-> menos, "greater"->maior
# nivel de confidencialidade = 95%-> conf.level = 0.95
t.test(dados$cilindros, alternative="two.sided", conf.level = 0.95, mu = 690)

#y= a+b*x
#Yestimado = -16.042718 + 0.009095*x-> para deslocamento
#Yestimado = -16.042718 + 0.211716*x-> para aceleracao
#Yestimado = -16.042718 + 0.742954*x-> para anoModelo

#(Intercept)->-16.042718 
#cilindros-> -0.201211
#deslocamento-> 0.009095
#peso-> -0.007048    
#aceleracao-> 0.211716  
#anoModelo -> 0.742954


#-------------------------------------------------------------#
# teste de normalidade      
#-------------------------------------------------------------#

boxplot(dados$mpg, dados$cilindros)

#Gráfico histograma
hist(dados$cilindros, col="yellow", main="Distribuição normal")

#Traçando a curva da normal
curve(dnorm, add=TRUE)
?curve

#Teste de Normalidade Shapiro-Wilk
shapiroNormalidadeY = shapiro.test(dados$mpg)

# Kolmogorov-Smirnov
ks.test(dados$mpg, "pnorm", mean(dados$mpg), sd(dados$mpg))

# visualizar valor do shapiro
shapiroNormalidadey$p.value

#Teste de Normalidade Shapiro-Wilk
shapiroNormalidadeX = shapiro.test(dados$cilindros)

# Kolmogorov-Smirnov
ks.test(dados$cilindros,"pnorm", mean(dados$cilindros), sd(dados$cilindros))

# cruzando os valores
t.test(x = dados$mpg, y = dados$cilindros, alternative="two.sided", conf.level = 0.95)
