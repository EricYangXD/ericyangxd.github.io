---
title: Kafka
author: EricYangXD
date: "2024-05-27"
meta:
  - name: keywords
    content: Kafka
---

## Kafka

RocketMQ 和 Kafka 都是高性能的消息中间件。

ZooKeeper 是通用的分布式协调服务，用于管理和协调分布式系统中的服务。不仅可以用于服务注册和发现，还可以用于分布式锁、分布式队列、分布式协调、配置管理等场景。

Kafka 通过 ZooKeeper 来管理集群的状态，比如 broker 的上下线、topic 的创建和删除等。

Kafka 的本质是日志消息代理。日志的特点就是`append-only`和不可变，它能带来的显而易见的好处是强大的局部性：内存中可以抽象为 buffer，内核态里它又是`page cache`，磁盘上它会集中在同一磁道，从上至下利于软件和操作系统进行快速写入，这也是为什么大量知名系统，不论是 MySQL Server 的`binlog`还是 redis 的`aof`都是使用类似的方式。

它是典型的 IO 密集型应用，所以它并不是线程池。Kafka 的大量技术细节都在解决 IO 性能，包括但不限于零拷贝、批量写入、mmap、sendfile、epoll、NIO、AIO、DMA 等等。

中间件只能解决分配问题，本质上只是一个缓冲区，并不能加快处理速度。首先你要弄清楚，消息队列是为了削峰才用的，要是生产者永远大于消费者，那还削什么峰，你需要做的第一件事是想办法让生产者的消息可以被处理，而不是削峰。

Kafka 的设计理念是`producer`和`consumer`之间的解耦，`producer`只管往 Kafka 写数据，`consumer`只管从 Kafka 读数据，Kafka 本身不会对数据进行处理，这样就可以实现`producer`和`consumer`的解耦，`producer`和`consumer`可以独立扩展，不会相互影响。

Kafka 主要解决的问题是：消息的生产者和消费者之间的解耦，消息的持久化，消息的分发，消息的订阅和发布。主要解决的还是提高可用性和削峰填谷的问题。

卡夫卡架构中消息队列的作用、优化方法和高可用性保障措施：

1. Kafka 是一个消息队列，通过将消息放在内存中的队列中，可以保护消息不被丢失。但是，这会带来性能问题，因此可以将队列挪到一个单独的进程中，从而解决性能问题。此外，还可以通过分区、分片、添加副本来扩展消息队列，提高性能和可用性。
2. 为了解决性能问题，可以对消息进行分类`Topic`，然后根据不同的分类新增队列的数量。此外，还可以将单个队列拆成好几段，每段就是一个分区`Partition`，这样可以大大降低争抢，提升性能。此外，还可以通过持久化和添加副本来解决数据丢失的问题。为了提升扩展性，可以将消息队列的多个`Partition`分别部署到多个 `broker` 上，这样即使一个 `broker` 挂了，也不会影响整个系统的运行。为了提升可用性，为`Partition`添加副本，分为`Leader`和`Follower`，这样即使一个 `broker` 挂了，也不会影响整个系统的运行。为了协调和管理 Kafka 集群的数据消息，可以使用 Zookeeper 作为协调节点。ZooKeeper 会和`broker`通信，监控 Kafka 集群的状态，维护 Kafka 集群信息，比如 `broker` 的上下线、`Topic` 的创建和删除等。此外，还可以通过添加副本来解决数据丢失的问题。
3. 为了解决数据丢失的问题，可以将数据持久化到磁盘中，这样即使全部 `broker` 都挂了，数据也不会全丢。此外，还可以通过添加副本来解决数据丢失的问题。

## RocketMQ

RocketMQ 和 Kafka 都是高性能的消息中间件。与 Kafka 相比，RocketMQ 在架构上做减法，在功能上做加法。简化了协调节点和分区模型把 Kafka 中的`Partition`改成`Queue`只存储简要信息比如消息的`offset`，完整信息存在`commitLog`中，然后可以通过`offset`去获取`commitLog`中对应的信息，去掉了 Zookeeper，使用更轻量的 NameServer 管理集群信息，提升了写性能和简化备份模型。与 Kafka 相比，RocketMQ 在功能上做了加法，支持消息过滤、事务和延时队列、死信队列、消息回溯等功能。

RocketMQ 将 topic 拆分为多个分区，只存储简要信息，消息的完整数据则放到一个叫 `commitLog` 的文件上。

RocketMQ 和 Kafka 两种消息队列的不同设计，主要在于底层存储和备份模型等方面。RocketMQ 使用 `commitLog` 文件存储消息，通过 NameServer 管理集群信息，简化了备份模型，提升了写性能。Kafka 使用 Zookeeper 管理集群信息，通过分区模型提升了读写性能，但增加了复杂度。

Kafka 的顺序写性能会随着分区数量的增加而降低，而 RocketMQ 的顺序写性能不会随着分区数量的增加而降低。

Kafka 读消息的时候，会从磁盘上读取数据，然后放到内存中，然后再返回给客户端。RocketMQ 读消息的时候，会从 commitLog 文件中读取数据，然后返回给客户端。

Kafka 读消息的时候只需要从`Partition`读取一次就够了，而 RocketMQ 读消息的时候 broker 需要先从`Queue`读取到`offset`的值，然后再通过`offset`去读取`commitLog`上完整的数据，也就是需要读两次。

Kafka 的底层存储：一个`Partition`会包含很多个`segment`，每个`segment`可以认为是一个小文件，存储数据实际上是写到`segment`上，对每个`segment`文件内部都是顺序写，但是当同时写多个 `topic` 底下的`Partition`时相当于同时写多个文件，由于是分布式的存储在磁盘的不同地方，写性能会降低。

RocketMQ 会把单个 `broker` 下的多个`Queue`的数据写到一个`commitLog`文件上，这样就不会同时写多个文件，写性能会提升。

RocketMQ 直接同步`commitLog`，以 broker 为单位区分主从，保持高可用的同时，简化了数据模型。
