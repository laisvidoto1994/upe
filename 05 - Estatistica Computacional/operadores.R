

x1=6
x2=4

# soma
z1=x1 + x2

# subtração
z2=x1 - x2

# multiplicação
z3=x1 * x2

# divisão
z4=x1 / x2

# potenciação
z5=x1 ^ 2
z52=x1 ** 2

# modulo
z6=x1 %% 3 


####################################
#operadores
a=7
b=5

# < menor que
a<8
# > maior que 
a>8
# <= menor igual
a<=8
# >= maior igual
a>=8
# == igual
a==8
# != diferente
a!=8
# & and
(a==8) & (b==6)
# | or
(a==8) | (b>6)

#construção de vetor

vetorString= c("eu","e","você")
vetorInteiros= c(1,2,3,4)

#trazer á primeira posição do vetor
vetorInteiros[1]

#

x=c(0, 8, 9, 7, 4, 2, 10, 0, 2, 1)


xa = x[x > 4]
xb = x[x > 2 & x <= 8]
x=seq(-2, 2, by=0.5)
x>=-1
x>=-1 & x<=1
x<=-1 | x>=1
 

####################################

A = c(20,22,25,30,24,22,40,32,24,21,24,190)

summary(A)
max(A)
min(A)
range(A)
#  MEDIA->mean(A) OU sum(A)/length(A)
mean(A)
median(A)
# Desvio padr�o
sd(A)
var(A)
CV=var(A)/mean(A)
var(A)
sum(A)
length(A)
sum(A)/length(A)

B = c(35,39,37,38,42,40,45,41,33,37,40,47)

summary(B)
# Desvio padr�o
sd(B)
var(B)
CV=var(B)/mean(B)


####################################

q = c(48,49,51,50,49)
quantile(q)
 
percentis = seq(.01,.99,.01)
quantile(q, percentis)
