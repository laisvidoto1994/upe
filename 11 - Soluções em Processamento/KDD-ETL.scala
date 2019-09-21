/* ===== KDD-ETL.scala ============

Especialização em Ciência de Dados e Analytics / POLI-UPE
Soluções para Processamento de Big Data

Spark / Big Data Machine Learning

Processo ETL sobre dados da KDDCUP'99 (4.898.431 observações, 41 dimensões)
Operações
  - StringIndexer
  - OneHotEncoder
  - VectorAssembler
  - HDFS save

Chamada: $ spark-shell --master spark://spark-node1:7077 --num-executors 2  --driver-memory 6G --executor-memory 4G  --executor-cores 4 -i KDD-ETL.scala

Tempo de ETL: 461 segundos.

Prof. Jairson B. Rodrigues
POLI-UPE/UNIVASF

jairson.rodrigues@univasf.edu.br

=================================== */

import java.util.Calendar

import org.apache.spark.sql.functions.udf
import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.ml.feature.{StringIndexer, VectorAssembler, OneHotEncoder}
import org.apache.spark.ml.linalg.SparseVector
import org.apache.spark.mllib.util.MLUtils
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.ml.Pipeline
import org.apache.spark.ml.PipelineStage
import org.apache.spark.ml.Transformer
import spark.implicits._

val t_total1 = Calendar.getInstance.getTime

val originalColumns = Array(
"duration",
"protocol_type",
"service",
"flag",
"src_bytes",
"dst_bytes",
"land",
"wrong_fragment",
"urgent",
"hot",
"num_failed_logins",
"logged_in",
"num_compromised",
"root_shell",
"su_attempted",
"num_root",
"num_file_creations",
"num_shells",
"num_access_files",
"num_outbound_cmds",
"is_host_login",
"is_guest_login",
"count",
"srv_count",
"serror_rate",
"srv_serror_rate",
"rerror_rate",
"srv_rerror_rate",
"same_srv_rate",
"diff_srv_rate",
"srv_diff_host_rate",
"dst_host_count",
"dst_host_srv_count",
"dst_host_same_srv_rate",
"dst_host_diff_srv_rate",
"dst_host_same_src_port_rate",
"dst_host_srv_diff_host_rate",
"dst_host_serror_rate",
"dst_host_srv_serror_rate",
"dst_host_rerror_rate",
"dst_host_srv_rerror_rate",
"label")

val categoricalColumns =  Array("protocol_type", "service", "flag", "land", "logged_in", "root_shell", "su_attempted", "is_host_login", "is_guest_login")
val allIndexedColumns: Array[String] = originalColumns.map( cname => s"${cname}_i") // i = indexed
val allIndexedCategoricalColumns: Array[String] = categoricalColumns.map( cname => s"${cname}_i") // i = indexed
val encodedColumns: Array[String] = categoricalColumns.map( cname => s"${cname}_ie") // iv = indexed, encoded
val finalFields = (allIndexedColumns.diff(allIndexedCategoricalColumns) ++ encodedColumns)

val raw_text = spark.read.option("header","false").csv("hdfs://hadoop-master:8020/kddcup/kddcup.data").toDF(originalColumns: _*).repartition(10)

// modifica o label categórico para variável alvo 0 (sem ataque) ou 1 (ataque)
val toClass   = udf((lbl: String) => if (lbl == "normal.") 0.0 else 1.0 )
val textDF = raw_text.withColumn("labelTmp", toClass(raw_text("label"))).drop("label").withColumnRenamed("labelTmp", "label")

// todas as variaveis serao indexadas
val indexer: Array[PipelineStage] = originalColumns.map(
cname => new StringIndexer().setInputCol(cname).setOutputCol(s"${cname}_i").setHandleInvalid("skip")
)

// aplicar one hot encoder apenas nas variáveis categoricas
val one_hot_encoder: Array[PipelineStage] = allIndexedCategoricalColumns.map(
cname => new OneHotEncoder().setInputCol(cname).setOutputCol(s"${cname}e")
)

val pipelineTmp = new Pipeline().setStages(indexer ++ one_hot_encoder)
val df = pipelineTmp.fit(textDF).transform(textDF)

val assembler = new VectorAssembler().setInputCols(finalFields.diff(Array("label_i"))).setOutputCol("features")
val outuput = assembler.transform(df).select("label_i", "features").withColumnRenamed("label_i", "label")

outuput.write.format("parquet").mode("overwrite").save("hdfs://hadoop-master:8020/kddcup/input/indexed_enconded_data")

val t_total2 = Calendar.getInstance.getTime
val diff_total = (t_total2.getTime() - t_total1.getTime())/1000

println("Tempo de ETL: " + diff_total + " segundos.")
