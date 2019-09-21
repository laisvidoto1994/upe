/* ===== KDD-NB.scala ============

Especialização em Ciência de Dados e Analytics / POLI-UPE
Soluções para Processamento de Big Data

Spark / Big Data Machine Learning

Classificador Naive Bayes sobre dados da KDDCUP'99 (4.898.431 observações, 41 dimensões)

Chamada: $ spark-shell --master spark://spark-node1:7077 --num-executors 2  --driver-memory 6G --executor-memory 4G  --executor-cores 4 -i KDD-NB.scala 

Tempo de treino e teste: 224 segundos

Prof. Jairson B. Rodrigues
POLI-UPE/UNIVASF

jairson.rodrigues@univasf.edu.br

=================================== */

import java.util.Calendar

import org.apache.spark.sql.functions.udf
import org.apache.spark.sql.SparkSession
import org.apache.spark.ml.classification.NaiveBayes
import org.apache.spark.ml.evaluation.BinaryClassificationEvaluator
import org.apache.spark.mllib.evaluation.BinaryClassificationMetrics
import org.apache.spark.ml.tuning.{CrossValidator, ParamGridBuilder}
import org.apache.spark.ml.Pipeline

import spark.implicits._

val t_total1 = Calendar.getInstance.getTime

val data = spark.read.parquet("hdfs://hadoop-master:8020/kddcup/input/indexed_enconded_data")

val random = Math.abs(scala.util.Random.nextInt)

val Array(trainingData, testData) = data.randomSplit(Array(0.7, 0.3), random)

val bayes = new NaiveBayes()

val pipeline = new Pipeline().setStages(Array(bayes))

val paramGrid = new ParamGridBuilder().addGrid(bayes.smoothing, Array(0.0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0)).build()

val cv = new CrossValidator().setEstimator(pipeline).setEvaluator(new BinaryClassificationEvaluator).setEstimatorParamMaps(paramGrid).setNumFolds(10)

val cvModel = cv.fit(trainingData)

val results = cvModel.transform(testData).select("prediction", "label")

val rows = results.collect()

val numCorrectPredictions = rows.map(row => if (row.getDouble(0) == row.getDouble(1)) 1 else 0).foldLeft(0)(_ + _)

val accuracy = 1.0D * numCorrectPredictions / rows.size

val predictionAndLabels = results.rdd.map(x => (x(0).asInstanceOf[Double], x(1).asInstanceOf[Double]))

val metrics = new BinaryClassificationMetrics(predictionAndLabels)

val t_total2 = Calendar.getInstance.getTime
val diff_total = (t_total2.getTime() - t_total1.getTime())/1000

println("Acuracia: " + accuracy)
println("Area sobre a curva PR: " + metrics.areaUnderPR)
println("Area sobre a curva ROC: " + metrics.areaUnderROC)
println("Tempo de treino e teste: " + diff_total + " segundos.")
