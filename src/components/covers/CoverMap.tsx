// 封面与流程示意图的组件注册表
// 通过字符串 ID 映射到实际组件，无需修改组件结构

import CaseStudy1Cover from './CaseStudy1Cover'
import CaseStudy2Cover from './CaseStudy2Cover'
import CaseStudy3Cover from './CaseStudy3Cover'
import CaseStudy4Cover from './CaseStudy4Cover'
import CaseStudy5Cover from './CaseStudy5Cover'

// 封面信息图映射
export const coverComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  CaseStudy1Cover,
  CaseStudy2Cover,
  CaseStudy3Cover,
  CaseStudy4Cover,
  CaseStudy5Cover,
}

// 流程示意图（Step 2 使用）
import FlowDiagram1 from './FlowDiagram1'
import FlowDiagram2 from './FlowDiagram2'
import FlowDiagram3 from './FlowDiagram3'
import FlowDiagram4 from './FlowDiagram4'
import FlowDiagram5 from './FlowDiagram5'

export const flowDiagrams: Record<string, React.ComponentType<{ className?: string }>> = {
  FlowDiagram1,
  FlowDiagram2,
  FlowDiagram3,
  FlowDiagram4,
  FlowDiagram5,
}
