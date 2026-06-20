#! /bin/bash

set -x
set -e
shopt -s expand_aliases

rm -f fifo;
mkfifo fifo

alias run_java="java -cp runtime/target/classes:benchmark/target/classes"

ITERS=100000

time run_java org.zap.benchmark.CarSales object no-reuse none $ITERS
time run_java org.zap.benchmark.CarSales bytes no-reuse none $ITERS
time run_java org.zap.benchmark.CarSales bytes no-reuse packed $ITERS
time run_java org.zap.benchmark.CarSales client no-reuse none $ITERS < fifo | run_java org.zap.benchmark.CarSales server no-reuse none $ITERS > fifo
time run_java org.zap.benchmark.CarSales client no-reuse packed $ITERS < fifo | run_java org.zap.benchmark.CarSales server no-reuse packed $ITERS > fifo


ITERS=10000
time run_java org.zap.benchmark.CatRank object no-reuse none $ITERS
time run_java org.zap.benchmark.CatRank bytes no-reuse none $ITERS
time run_java org.zap.benchmark.CatRank bytes no-reuse packed $ITERS
time run_java org.zap.benchmark.CatRank client no-reuse none $ITERS < fifo | run_java org.zap.benchmark.CatRank server no-reuse none $ITERS > fifo
time run_java org.zap.benchmark.CatRank client no-reuse packed $ITERS < fifo | run_java org.zap.benchmark.CatRank server no-reuse packed $ITERS > fifo


ITERS=2000000
time run_java org.zap.benchmark.Eval object no-reuse none $ITERS
time run_java org.zap.benchmark.Eval bytes no-reuse none $ITERS
time run_java org.zap.benchmark.Eval bytes no-reuse packed $ITERS
time run_java org.zap.benchmark.Eval client no-reuse none $ITERS < fifo | run_java org.zap.benchmark.Eval server no-reuse none $ITERS > fifo
time run_java org.zap.benchmark.Eval client no-reuse packed $ITERS < fifo | run_java org.zap.benchmark.Eval server no-reuse packed $ITERS > fifo

