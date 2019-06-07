#metodo de monte carlo-> eu tiro varias amostrar da base e calculo as medias e desviopadrão e formulas para achar o 
#ponto medio de todas as medias de todas as amostras para garantir maior credibilidade dos dados


#Holdout -> em treinamento em p, tem que ter mais de 50% dos dados
#ele é mais demorado

#p= tamanho total da amostra
#p = 2/3 e (1 – p) = 1/3 


#K-Fold CrossValidation->em treinamento

#exemplo
#amostra com 100 elementos
#quero dividir em 5 por exemplo

#100/5->25 registros


#Leave-One-Out ->em treinamento para bases pequenas


#Bootstrap -> para bases muito grandes


#Gerando números aleatórios com distribuição  normal depois de fazer o monte carlo:

#Gerando aleatoriamente os dados
dados = rnorm(100)

#Gráfico
hist(dados, col="yellow", main="Distribuição normal")

#Traçando a curva da normal
curve(dnorm, add=TRUE)

#Teste de Normalidade
# Shapiro-Wilk
shapiro.test(dados)
# Kolmogorov-Smirnov
ks.test(dados,"pnorm", mean(dados), sd(dados))
 
################

# exemplo Teste t de Student para uma amostra
#dados da amostra
tempoDePintura = c(920,710,680,1000,1010,850,880,990,1030,995,775,670)
#media 
media = mean(tempoDePintura)#875,833
#desvio padrao
desvio = sd(tempoDePintura)#136,662

#grafico
hist(tempoDePintura, col="yellow", main="pintura")
  
#Teste de Normalidade
# Shapiro-Wilk
shapiro.test(tempoDePintura)
# Kolmogorov-Smirnov
ks.test(tempoDePintura,"pnorm", media, desvio)

# alternativas-> "two.sided", "less"-> menos, "greater"->maior
# nivel de confidencialidade = 95%-> conf.level = 0.95
t.test(tempoDePintura, alternative="two.sided", conf.level = 0.95, mu = 690)
  

################

#exemplo de Teste t de Student para duas amostras aleatórias  independentes 

dadoX = c(16,22,27,20,18,24,19,20,21,25)
dadoY = c(30,25,25,28,27,33,24,22,24,29)

boxplot(dadoX,dadoY)


hist(dadoX)
hist(dadoY)

#Teste de Normalidade
  
# Shapiro-Wilk
shapiro.test(dadoX)
# Kolmogorov-Smirnov
ks.test(dadoX,"pnorm", mean(dadoX), sd(dadoX))
  
# Shapiro-Wilk
shapiro.test(dadoY)
# Kolmogorov-Smirnov
ks.test(dadoY,"pnorm", mean(dadoY), sd(dadoY))

t.test(x=dadoX, y=dadoY, alternative="two.sided", conf.level = 0.95)



################
#exemplo de Teste t de Student para duas amostras aleatórias  relacionadas (pareadas) 



antes  = c(5.5, 6.1, 6.7, 6.2, 7.0, 7.2, 5.8, 6.8, 6.7, 7.4, 5.0)
depois = c(6.0, 7.2, 6.8, 8.2, 9.0, 5.8, 6.5, 7.2, 8.7, 5.0, 9.2)
 
boxplot(antes,depois)
 
hist(antes)
hist(depois)
 

#Teste de Normalidade

# Shapiro-Wilk
shapiro.test(antes)
# Kolmogorov-Smirnov
ks.test(antes,"pnorm", mean(antes), sd(antes))

# Shapiro-Wilk
shapiro.test(depois)
# Kolmogorov-Smirnov
ks.test(depois,"pnorm", mean(depois), sd(depois))

t.test(antes, depois, paired = TRUE, conf.level = 0.90)

